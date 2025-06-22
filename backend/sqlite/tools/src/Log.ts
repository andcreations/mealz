export class Log {
  public static info(message: string): void {
    console.log(message);
  }

  public static error(message: string, error?: any): void {
    console.error(message);
    if (error && error instanceof Error) {
      console.error(error.stack);
    }
  }
}