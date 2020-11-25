import { ICache, ICacheStore, ICacheOptions } from "../../interfaces";
import { Cache, MemoryCacheStore } from "../../cache";

describe("when getting a list of values from the cache", () => {
  const key = "cache_key";
  const entriesKey = "cache_entries_key";
  const SECONDS_IN_HOUR = 3600;
  let sut: ICache;
  let mockStore: ICacheStore;

  beforeEach(() => {
    mockStore = new MemoryCacheStore();
    const cacheOptions: ICacheOptions = {
      capacity: 2,
      store: mockStore,
      ttl: SECONDS_IN_HOUR,
      entriesKey,
    };
    sut = new Cache(cacheOptions);
  });

  it("should successfully retrieve all keys' values", async () => {
    const cacheKeys: Array<string> = [];
    const expected: { [cacheKey: string]: number } = {};
    for (let i = 0; i < 2; i++) {
      const cacheKey = `${key}-${i}`;
      cacheKeys.push(cacheKey);
      expected[cacheKey] = i;
      await sut.setAsync(cacheKey, i);
    }

    const actual: { [cacheKey: string]: number } = await sut.getAllAsync(cacheKeys);

    expect(actual).toStrictEqual(expected);
  });
});
