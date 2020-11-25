import { ICache, ICacheStore, ICacheOptions } from "../../src/interfaces";
import { Cache, MemoryCacheStore } from "../../src/cache";

describe("when removing a value from the cache", () => {
  const key = "cache_key";
  const entriesKey = "cache_entries_key";
  const SECONDS_IN_HOUR = 3600;
  let sut: ICache;
  let mockStore: ICacheStore;

  beforeEach(() => {
    mockStore = new MemoryCacheStore();
    const cacheOptions: ICacheOptions = {
      capacity: 1,
      store: mockStore,
      ttl: SECONDS_IN_HOUR,
      entriesKey,
    };
    sut = new Cache(cacheOptions);
  });

  it("should remove value correctly", async () => {
    await sut.setAsync(key, key);

    await sut.removeAsync(key);
    const actual = await sut.getAsync<string>(key);

    expect(actual).toBeNull();
  });
});
