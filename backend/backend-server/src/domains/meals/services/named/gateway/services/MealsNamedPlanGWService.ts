import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { DEFAULT_READ_LIMIT } from '@mealz/backend-common';
import { GWMealMapper } from '@mealz/backend-meals-gateway-common';
import { UserWithoutPassword } from '@mealz/backend-users-common';
import { UsersCrudTransporter } from '@mealz/backend-users-crud-service-api';
import {
  MealsCrudTransporter,
  ReadMealByIdRequestV1,
} from '@mealz/backend-meals-crud-service-api';
import {
  ReadNamedMealsFromLastQueryParamsV1,
} from '@mealz/backend-meals-named-gateway-api';
import {
  CreateNamedMealRequestV1,
  DeleteNamedMealRequestV1,
  ListShareUsersRequestV1,
  MealsNamedTransporter,
  ReadNamedMealByIdRequestV1,
  ReadNamedMealsFromLastRequestV1,
  UpdateNamedMealRequestV1,
} from '@mealz/backend-meals-named-service-api';

import {
  CreateNamedMealGWRequestV1Impl,
  CreateNamedMealGWResponseV1Impl,
  ListShareUsersGWResponseV1Impl,
  ReadNamedMealByIdGWResponseV1Impl,
  ReadNamedMealsFromLastGWResponseV1Impl,
  UpdateNamedMealGWRequestV1Impl,
} from '../dtos';
import { GWNamedMealMapper } from './GWNamedMealMapper';
import { GWShareUserMapper } from './GWShareUserMapper';

@Injectable()
export class MealsNamedPlanGWService {
  public constructor(
    private readonly usersCrudTransporter: UsersCrudTransporter,
    private readonly mealsNamedTransporter: MealsNamedTransporter,
    private readonly mealsCrudTransporter: MealsCrudTransporter,
    private readonly gwNamedMealMapper: GWNamedMealMapper,
    private readonly gwShareUserMapper: GWShareUserMapper,
    private readonly gwMealMapper: GWMealMapper,
  ) {}

  public async readByIdV1(
    namedMealId: string,
    userId: string,
    context: Context,
  ): Promise<ReadNamedMealByIdGWResponseV1Impl> {
    const namedMealRequest: ReadNamedMealByIdRequestV1 = {
      id: namedMealId,
      userId,
    };
    const { namedMeal } = await this.mealsNamedTransporter.readNamedMealByIdV1(
      namedMealRequest,
      context,
    );

    const mealRequest: ReadMealByIdRequestV1 = {
      id: namedMeal.mealId,
    };
    const [{ meal }, readUserResponse] = await Promise.all([
      this.mealsCrudTransporter.readMealByIdV1(
        mealRequest,
        context,
      ),
      namedMeal.sharedByUserId
        ? this.usersCrudTransporter.readUserByIdV1(
            { id: namedMeal.sharedByUserId },
            context,
          )
        : undefined,
    ]);

    return {
      namedMeal: this.gwNamedMealMapper.fromNamedMeal(
        namedMeal,
        readUserResponse?.user,
      ),
      meal: this.gwMealMapper.fromMeal(meal),
    };
  }

  public async readFromLastV1(
    gwParams: ReadNamedMealsFromLastQueryParamsV1,
    userId: string,
    context: Context,
  ): Promise<ReadNamedMealsFromLastGWResponseV1Impl> {
    // read named meals
    const request: ReadNamedMealsFromLastRequestV1 = {
      userId,
      lastId: gwParams.lastId,
      limit: gwParams.limit ?? DEFAULT_READ_LIMIT,
    };
    const {
      namedMeals,
    } = await this.mealsNamedTransporter.readNamedMealsFromLastV1(
      request,
      context,
    );


    // read shared by users
    const sharedByUserIds = namedMeals
      .map(namedMeal => namedMeal.sharedByUserId)
      .filter(Boolean);
    const sharedByUsers = await this.readUsersByIds(
      sharedByUserIds,
      context,
    );

    return {
      namedMeals: this.gwNamedMealMapper.fromNamedMeals(
        namedMeals,
        sharedByUsers,
      ),
    };
  }

  public async createV1(
    gwRequest: CreateNamedMealGWRequestV1Impl,
    userId: string,
    context: Context,
  ): Promise<CreateNamedMealGWResponseV1Impl> {
    const request: CreateNamedMealRequestV1 = {
      userId,
      meal: gwRequest.meal,
      mealName: gwRequest.mealName,
    };
    const { id } = await this.mealsNamedTransporter.createNamedMealV1(
      request,
      context,
    );
    return { id };
  }

  public async updateV1(
    namedMealId: string,
    gwRequest: UpdateNamedMealGWRequestV1Impl,
    userId: string,
    context: Context,
  ): Promise<void> {
    const request: UpdateNamedMealRequestV1 = {
      namedMealId,
      userId,
      meal: gwRequest.meal,
      mealName: gwRequest.mealName,
    };
    await this.mealsNamedTransporter.updateNamedMealV1(
      request,
      context,
    );
  }

  public async deleteV1(
    namedMealId: string,
    userId: string,
    context: Context,
  ): Promise<void> {
    const request: DeleteNamedMealRequestV1 = {
      id: namedMealId,
      userId,
    };
    await this.mealsNamedTransporter.deleteNamedMealV1(request, context);
  }

  public async listShareUsersV1(
    userId: string,
    context: Context,
  ): Promise<ListShareUsersGWResponseV1Impl> {
    const request: ListShareUsersRequestV1 = {
      userId,
    };
    const { shareUsers } = await this.mealsNamedTransporter.listShareUsersV1(
      request,
      context,
    );

    return {
      shareUsers: this.gwShareUserMapper.fromShareUsers(shareUsers),
    };
  }

  private async readUsersByIds(
    userIds: string[],
    context: Context,
  ): Promise<UserWithoutPassword[]> {
    if (userIds.length === 0) {
      return [];
    }

    // read unique users
    const userIdsSet = new Set(userIds);
    const { users } = await this.usersCrudTransporter.readUsersByIdsV1(
      { ids: Array.from(userIdsSet) },
      context,
    );
    return users;
  }
}