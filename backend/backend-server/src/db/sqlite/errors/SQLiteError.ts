export class SQLiteError extends Error {
  public errno: number;
  public code: string;

  public constructor(errno: number, code: string, message: string) {
    super(message);
    this.errno = errno;
    this.code = code;
  }

  public static isSQLiteError(error: any): error is SQLiteError {
    return (
      error instanceof Error &&
      'errno' in error &&
      'code' in error
    );
  }
}