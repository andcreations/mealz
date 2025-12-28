import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { 
  CreateUserRequestV1,
  UsersCrudTransporter,
} from '@mealz/backend-users-crud-service-api';
import { CreateUserGWRequestV1 } from '@mealz/backend-users-crud-gateway-api';

@Injectable()
export class UsersCrudGWService {
  public constructor(
    private readonly usersCrudTransporter: UsersCrudTransporter,
  ) {}

  public async createUserV1(
    gwRequest: CreateUserGWRequestV1,
    context: Context,
  ): Promise<void> {
    const request: CreateUserRequestV1 = {
      user: {
        firstName: gwRequest.firstName,
        lastName: gwRequest.lastName,
        email: gwRequest.email,
        password: gwRequest.password,
      },
    };
    await this.usersCrudTransporter.createUserV1(request, context);
  }
}