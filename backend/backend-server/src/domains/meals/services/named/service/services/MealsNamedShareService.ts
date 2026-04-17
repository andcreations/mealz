import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { TranslateFunc, createTranslation } from '@mealz/backend-common';
import { VoidTransporterResponse } from '@mealz/backend-transport';
import { SocketRequestTransporter } from '@mealz/backend-socket-api';
import { UsersCrudTransporter } from '@mealz/backend-users-crud-service-api';
import { MealsCrudTransporter } from '@mealz/backend-meals-crud-service-api';
import {
  ActionForCreation,
  ActionsManagerTransporter,
} from '@mealz/backend-actions-manager-service-api';
import {
  ChunkedUserNotificationChunk,
  htmlToNotificationChunks,
  NotificationAction,
  UsersNotificationsTransporter,
} from '@mealz/backend-users-notifications-service-api';
import {
  MEALS_NAMED_DOMAIN,
  MEALS_NAMED_SERVICE,
  MealsNamedRequestTopics,
  ShareNamedMealActionPayload,
  ShareNamedMealRequestV1,
} from '@mealz/backend-meals-named-service-api';
import {
  ADDED_NAMED_MEAL_SOCKET_MESSAGE_TOPIC_V1,
  AddedNamedMealSocketMessageV1Payload,
} from '@mealz/backend-meals-named-gateway-api';

import {
  MEALS_NAMED_CREATED_TELEGRAM_MESSAGE_TYPE_ID,
  MEALS_NAMED_ERROR_TELEGRAM_MESSAGE_TYPE_ID,
  MEALS_NAMED_SHARED_TELEGRAM_MESSAGE_TYPE_ID,
} from '../consts';
import {
  MealsNamedShareServiceTranslations,
} from './MealsNamedShareService.translations';
import { MealsNamedCrudService } from './MealsNamedCrudService';

@Injectable()
export class MealsNamedShareService {
  private readonly translate: TranslateFunc;

  public constructor(
    private readonly actionsManagerTransporter: ActionsManagerTransporter,
    private readonly usersCrudTransporter: UsersCrudTransporter,
    private readonly mealsCrudTransporter: MealsCrudTransporter,
    private readonly mealsNamedCrudService: MealsNamedCrudService,
    private readonly socketRequestTransporter: SocketRequestTransporter,
    private readonly usersNotificationsTransporter:
      UsersNotificationsTransporter,
  ) {
    this.translate = createTranslation(MealsNamedShareServiceTranslations);
  }

  private async buildShareNamedMealNotificationChunks(
    request: ShareNamedMealRequestV1,
    context: Context,
  ): Promise<ChunkedUserNotificationChunk[]> {
    // users
    const [namedMeal, fromUser] = await Promise.all([
      this.mealsNamedCrudService.readNamedMealById(
        request.namedMealId,
        context,
      ),
      this.usersCrudTransporter.readUserByIdV1(
        { id: request.sharedByUserId }, 
        context,
      ),
    ]);

    // chunks
    const { chunks } = htmlToNotificationChunks(
      this.translate(
        'user-shared-named-meal',
        fromUser.user.firstName,
        namedMeal.mealName,
      ),
    );

    return chunks;
  }

  public async shareNamedMealV1(
    request: ShareNamedMealRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    const { canSendMessagesTo } =
      await this.usersNotificationsTransporter.readUserNotificationsInfoV1(
        {
          userId: request.sharedWithUserId,
        },
        context,
      );
    if (!canSendMessagesTo) {
      throw new Error('User cannot receive messages');
    }

    // action
    const payload: ShareNamedMealActionPayload = {
      namedMealId: request.namedMealId,
      sharedByUserId: request.sharedByUserId,
      sharedWithUserId: request.sharedWithUserId,
    };
    const action: ActionForCreation = {
      domain: MEALS_NAMED_DOMAIN,
      service: MEALS_NAMED_SERVICE,
      topic: MealsNamedRequestTopics.RunShareNamedMealActionV1,
      payload,
    };

    // create action
    const { id } = await this.actionsManagerTransporter.createActionV1(
      { action },
      context,
    );

    // chunks & notification action
    const notificationChunks = await this.buildShareNamedMealNotificationChunks(
      request,
      context,
    );
    const notificationAction: NotificationAction = {
      id,
      title: this.translate('accept'),
    };

    // send notification
    await this.usersNotificationsTransporter.sendChunkedUserNotificationV1(
      {
        userId: request.sharedWithUserId,
        messageTypeId: MEALS_NAMED_SHARED_TELEGRAM_MESSAGE_TYPE_ID,
        notification: {
          chunks: notificationChunks,
          actions: [notificationAction],
        },
      },
      context,
    );

    return {};
  }

  private buildNamedMealCreatedNotificationChunks(
    mealName: string,
    context: Context,
  ): ChunkedUserNotificationChunk[] {
    const { chunks } = htmlToNotificationChunks(
      this.translate(
        'user-created-named-meal',
        mealName,
      ),
    );
    return chunks;
  }

  public async runShareNamedMealActionV1(
    request: ShareNamedMealActionPayload,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    const notifyAboutError = async (message: string) => {
      await this.usersNotificationsTransporter.sendBasicUserNotificationV1(
        {
          userId: request.sharedWithUserId,
          messageTypeId: MEALS_NAMED_ERROR_TELEGRAM_MESSAGE_TYPE_ID,
          notification: {
            message,
          },
        },
        context,
      );
    }

    // read named meal
    const namedMeal = await this.mealsNamedCrudService.readNamedMealById(
      request.namedMealId,
      context,
    );

    if (!namedMeal) {
      await notifyAboutError(this.translate('named-meal-not-found'));
      return {};
    }

    // read meal
    const { meal } = await this.mealsCrudTransporter.readMealByIdV1(
      { id: namedMeal.mealId },
      context,
    );
    if (!meal) {
      await notifyAboutError(this.translate('meal-not-found'));
      return {};
    }

    const { id, ...mealWithoutId } = meal;
    // create new named meal
    await this.mealsNamedCrudService.createNamedMealV1(
      {
        meal: mealWithoutId,
        userId: request.sharedWithUserId,
        mealName: namedMeal.mealName,
        sharedByUserId: request.sharedByUserId,
      },
      context,
    );

    // send notification
    const notificationChunks = this.buildNamedMealCreatedNotificationChunks(
      namedMeal.mealName,
      context,
    );
    await this.usersNotificationsTransporter.sendChunkedUserNotificationV1(
      {
        userId: request.sharedWithUserId,
        messageTypeId: MEALS_NAMED_CREATED_TELEGRAM_MESSAGE_TYPE_ID,
        notification: {
          chunks: notificationChunks,
        },
      },
      context,
    );

    // send socket message
    await this.socketRequestTransporter.sendMessageToUserV1<
      AddedNamedMealSocketMessageV1Payload
    >(
      {
        userId: request.sharedWithUserId,
        payload: {
          topic: ADDED_NAMED_MEAL_SOCKET_MESSAGE_TOPIC_V1,
          payload: { namedMealId: namedMeal.id },
        },
      },
      context,
    );

    return {};
  }
}