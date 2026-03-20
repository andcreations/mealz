import { Service } from '@andcreations/common';

@Service()
export class AuthUserService {
  private userId: string | undefined;

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public getUserId(): string | undefined {
    return this.userId;
  }

  public isSignedIn(): boolean {
    return this.userId !== undefined;
  }
}