import { Service } from '@andcreations/common';

@Service()
export class LocalStorage {
  private static readonly PREFIX = 'mealz-';

  private buildKey(key: string): string {
    return `${LocalStorage.PREFIX}${key}`;
  }

  public setItem<T>(key: string, value: T): void {
    localStorage.setItem(this.buildKey(key), JSON.stringify(value));
  }

  public getItem<T>(key: string): T | undefined {
    const value = localStorage.getItem(this.buildKey(key));
    return value ? JSON.parse(value) as T : undefined;
  }

  public async getItemAsync<T>(key: string): Promise<T | undefined> {
    const value = localStorage.getItem(this.buildKey(key));
    return value ? JSON.parse(value) as T : undefined;
  }
}