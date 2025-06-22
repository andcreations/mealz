/** */
export class MealzError extends Error {
  /** */
  public constructor(
    private readonly msg: string,
    private readonly code: string,
    private readonly httpStatus,
  ) {
    super(msg);
  }

  public getMessage(): string {
    return this.msg;
  }

  public getCode(): string {
    return this.code;
  }

  public getHTTPStatus(): number {
    return this.httpStatus;
  }

  public static quote(str: string): string {
    return `"${str}"`;
  }
}