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

  it("should return null when key does not exist", async () => {
    const actual = await sut.getAsync(key);

    expect(actual).toBeNull();
  });
});

it("should return null when the cache entry is expired", async () => {
  const sut: ICache = new Cache({ capacity: 1, namespace: "low-ttl", ttl: 1 });
  const key = "key";

  await sut.setAsync(key, key);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const actual = await sut.getAsync<string>(key);

  expect(actual).toBeNull();
});
