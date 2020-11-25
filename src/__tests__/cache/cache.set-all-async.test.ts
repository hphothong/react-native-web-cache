import { ICache, ICacheStore, ICacheOptions } from "../../interfaces";
import { Cache, MemoryCacheStore } from "../../cache";

describe("when setting a list of values from the cache", () => {
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

  it("should successfully set all keys' values", async () => {
    const cacheKeys: Array<string> = [];
    const tuples: Array<[string, number]> = [];
    for (let i = 0; i < 2; i++) {
      const cacheKey = `${key}-${i}`;
      cacheKeys.push(cacheKey);
      tuples.push([cacheKey, i]);
    }

    await sut.setAllAsync(tuples);
    const actual: Array<[string, number]> = await sut.getAllAsync(cacheKeys);

    expect(actual).toStrictEqual(tuples);
  });
});
