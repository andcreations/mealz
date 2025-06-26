import { Colors } from './Colors';
import { errorToMessage } from './error';

export class Log {
  public static info(message: string): void {
    console.log(message);
  }

  public static error(message: string, error?: any): void {
    const hasError = !!error;

    const color = hasError ? Colors.none : Colors.red;
    console.log(color(message));

    if (hasError) {
      const message = errorToMessage(error);
      console.error(Colors.red(message));
    }
  }
}