import { Cache, MemoryCacheStore } from "../../cache";
import { ICache, ICacheOptions, ICacheStore } from "../../interfaces";

describe("when setting an item in the cache", () => {
  const key = "cache_key";
  const entriesKey = "cache_entries_key";
  const MILLIS_IN_HOUR = 1000 * 60 * 60;
  let sut: ICache;
  let mockStore: ICacheStore;

  beforeEach(() => {
    mockStore = new MemoryCacheStore();
    const cacheOptions: ICacheOptions = {
      capacity: 1,
      store: mockStore,
      ttl: MILLIS_IN_HOUR,
      entriesKey,
    };
    sut = new Cache(cacheOptions);
  });

  it("should set value correctly", async () => {
    const expected = 10;

    await sut.setAsync(key, expected);

    const actual = JSON.parse(await mockStore.getItem(key)).value;
    expect(actual).toBe(expected);
  });

  it("should set expiration correctly", async () => {
    const expected: number = new Date().getTime() + MILLIS_IN_HOUR;

    await sut.setAsync(key, "");

    const actual: number = JSON.parse(await mockStore.getItem(key)).expiration;
    expect(actual - expected).toBeCloseTo(0);
  });

  it("should add the key to the cache entries", async () => {
    const expected: Array<string> = [key];

    await sut.setAsync(key, "");

    const actual: Array<string> = JSON.parse(await mockStore.getItem(entriesKey));
    expect(actual).toStrictEqual(expected);
  });

  it("should replace the key and value if at capacity", async () => {
    const expectedKeys: Array<string> = [key];
    const expectedValues: Array<string> = [key];

    await sut.setAsync(`${key}-diff`, `${key}-diff`);
    await sut.setAsync(key, key);

    const allKeys: Array<string> = await mockStore.getAllKeys();
    const actualKeys: Array<string> = allKeys.filter((key: string): boolean => key !== entriesKey);
    const allValues: Array<[string, string]> = await mockStore.multiGet(actualKeys);
    const actualValues: Array<string> = allValues.map((tuple: [string, string]): string => JSON.parse(tuple[1]).value);
    expect(actualKeys).toStrictEqual(expectedKeys);
    expect(actualValues).toStrictEqual(expectedValues);
  });

  it("should replace the cache entry if the key already exists", async () => {
    const expectedKeys: Array<string> = [key];
    const expectedValues: Array<string> = [`${key}-expected`];

    await sut.setAsync(key, key);
    await sut.setAsync(key, `${key}-expected`);

    const allKeys: Array<string> = await mockStore.getAllKeys();
    const actualKeys: Array<string> = allKeys.filter((key: string): boolean => key !== entriesKey);
    const allValues: Array<[string, string]> = await mockStore.multiGet(actualKeys);
    const actualValues: Array<string> = allValues.map((tuple: [string, string]): string => JSON.parse(tuple[1]).value);
    expect(actualKeys).toStrictEqual(expectedKeys);
    expect(actualValues).toStrictEqual(expectedValues);
  });
});
