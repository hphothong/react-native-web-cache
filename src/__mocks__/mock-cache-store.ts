import { ICacheStore } from "../interfaces";

export class MockCacheStore implements ICacheStore {
  private cache: { [key: string]: string };

  public constructor() {
    this.cache = {};
  }

  public getItem(key: string): Promise<string | null> {
    return new Promise((resolve) => {
      resolve(this.cache[key] ?? null);
    });
  }

  public setItem(key: string, value: string): Promise<void> {
    return new Promise((resolve) => {
      this.cache[key] = value;
      resolve();
    });
  }

  public removeItem(key: string): Promise<void> {
    return new Promise((resolve) => {
      delete this.cache[key];
      resolve();
    });
  }

  public getAllKeys(): Promise<Array<string>> {
    return new Promise((resolve) => {
      resolve(Object.keys(this.cache));
    });
  }

  public multiGet(keys: string[]): Promise<Array<[string, string]>> {
    return new Promise((resolve) => {
      const results: Array<[string, string]> = [];
      keys.forEach((key: string) => results.push([key, this.cache[key] ?? null]));
      resolve(results);
    });
  }

  public multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    return new Promise((resolve) => {
      keyValuePairs.forEach((tuple: [string, string]) => (this.cache[tuple[0]] = tuple[1]));
      resolve();
    });
  }

  public multiRemove(keys: string[]): Promise<void> {
    return new Promise((resolve) => {
      keys.forEach((key: string) => delete this.cache[key]);
      resolve();
    });
  }
}
