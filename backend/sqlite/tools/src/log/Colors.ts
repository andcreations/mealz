import * as colors from 'ansi-colors';

export class Colors {
  public static none(str: string): string {
    return str;
  }

  public static red(str: string): string {
    return colors.red(str);
  }

  public static yellow(str: string): string {
    return colors.yellow(str);
  }

  public static green(str: string): string {
    return colors.green(str);
  }

  public static blue(str: string): string {
    return colors.blue(str);
  }

  public static magenta(str: string): string {
    return colors.magenta(str);
  }

  public static cyan(str: string): string {
    return colors.cyan(str);
  }

  public static white(str: string): string {
    return colors.white(str);
  }

  public static gray(str: string): string {
    return colors.gray(str);
  }
}