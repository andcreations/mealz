export class Log {
  static isDebug(): boolean {
    return true;
  }

  static debug(msg: string): void {
    if (this.isDebug()) {
      console.log(`DBUG ${msg}`);
    }
  }

  static info(msg: string): void {
    console.log(`INFO ${msg}`);
  }

  static error(msg: string, error?: any): void {
    let errorMsg = error ? 'Unknown error' : '';
    if (error instanceof Error) {
      errorMsg = '\n' + error.stack;
    }
    console.log(`EROR ${msg}: ${errorMsg}`);
  }

  static quote(msg: string): string {
    return `"${msg}"`;
  }

  static logAndRethrow<T>(
    func: () => Promise<T>,
    errorMsg?: string,
  ): Promise<T> {
    try {
      return func();
    } catch (error) {
      this.error(errorMsg ?? 'Caught error during async function call', error);
      throw error;
    }
  }
}