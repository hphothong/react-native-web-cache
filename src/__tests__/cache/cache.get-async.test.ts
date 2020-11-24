import { ICache, ICacheStore, ICacheOptions } from "../../interfaces";
import { Cache, MemoryCacheStore } from "../../cache";

describe("when getting a value from the cache", () => {
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

  it("should retrieve value correctly", async () => {
    const expected = 10;
    await sut.setAsync(key, expected);

    const actual: number = await sut.getAsync<number>(key);

    expect(actual).toBe(expected);
  });
});
