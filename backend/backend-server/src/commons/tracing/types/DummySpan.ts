import { Span } from './Span';

export class DummySpan implements Span {
  public setAttribute(key: string, value: string): void {
    // do nothing
  }
  public ok(): void {
    // do nothing
  }
  public error(error: any): void {
    // do nothing
  }
  public end(): void {
    // do nothing
  }
}