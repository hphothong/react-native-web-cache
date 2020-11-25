import { ICache, ICacheStore, ICacheOptions } from "../../interfaces";
import { Cache, MemoryCacheStore } from "../../cache";

describe("when removing all values from the cache", () => {
  const key = "cache_key";
  const entriesKey = "cache_entries_key";
  const SECONDS_IN_HOUR = 3600;
  let sut: ICache;
  let mockStore: ICacheStore;

  beforeEach(() => {
    mockStore = new MemoryCacheStore();
    const cacheOptions: ICacheOptions = {
      capacity: 10,
      store: mockStore,
      ttl: SECONDS_IN_HOUR,
      entriesKey,
    };
    sut = new Cache(cacheOptions);
  });

  it("should remove value correctly", async () => {
    const cacheKeys: Array<string> = [];
    for (let i = 0; i < 10; i++) {
      const cacheKey = `${key}-${i}`;
      cacheKeys.push(cacheKey);
      await sut.setAsync(cacheKey, i);
    }

    await sut.removeAllAsync();

    for (let i = 0; i < 10; i++) {
      const cacheKey: string = cacheKeys[i];
      const actual = await sut.getAsync<number>(cacheKey);
      expect(actual).toBeNull();
    }
  });
});
