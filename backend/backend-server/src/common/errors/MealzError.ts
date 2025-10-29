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

  public static quote(value: string | string[]): string {
    if (Array.isArray(value)) {
      const count = 4;
      const items = value.slice(0, count);
      const rest = value.length > items.length
        ? `... (${value.length - items.length} more)`
        : '';
      return `"${items.join(',')}${rest}"`;
    }
    return `"${value}"`;
  }
}
