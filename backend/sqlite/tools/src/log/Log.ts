import { Colors } from './Colors';
import { errorToMessage } from './error';

export class Log {
  public static info(message: string): void {
    console.log(message);
  }

  public static error(message: string, error?: any): void {
    const hasError = !!error;

    if (!hasError) {
      console.error(Colors.red(message));
    }

    if (hasError) {
      const errorMessage = errorToMessage(error);
      console.error(message + ' | ' + Colors.red(errorMessage));
      if (error.stack) {
        const lines = error.stack.split('\n');
        for (const line of lines) {
          console.error(Colors.gray(line));
        }
      }
    }
  }
}