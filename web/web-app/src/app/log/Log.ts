export class Log {
  public static isDebug(): boolean {
    return true;
  }

  public static debug(msg: string): void {
    if (this.isDebug()) {
      console.log(`DBUG ${msg}`);
    }
  }

  public static info(msg: string): void {
    console.log(`INFO ${msg}`);
  }

  public static error(msg: string, error?: any): void {
    let errorMsg = '';
    if (error instanceof Error) {
      errorMsg = error.message + '\n' + error.stack;
    }
    else {
      errorMsg = 'Unknown error';
    }
    console.log(`EROR ${msg}: ${errorMsg}`);
  }

  public static quote(msg: string): string {
    return `"${msg}"`;
  }

  public static async logAndRethrow<T>(
    func: () => Promise<T>,
    errorMsg?: string,
  ): Promise<T> {
    try {
      return await func();
    } catch (error) {
      this.error(errorMsg ?? 'Caught error during async function call', error);
      throw error;
    }
  }
}