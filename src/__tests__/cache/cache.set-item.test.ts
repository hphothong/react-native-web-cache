import { Cache } from "../../cache";
import { ICache, ICacheOptions, ICacheStore } from "../../interfaces";
import { MockCacheStore } from "../../__mocks__/mock-cache-store";

describe("when setting an item in the cache", () => {
  const key = "cache_key";
  const entriesKey = "cache_entries_key";
  const SECONDS_IN_HOUR = 3600;
  let sut: ICache;
  let mockStore: ICacheStore;

  beforeEach(() => {
    mockStore = new MockCacheStore();
    const cacheOptions: ICacheOptions = {
      capacity: 1,
      store: mockStore,
      ttl: SECONDS_IN_HOUR,
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
    const expected: Date = new Date();
    expected.setSeconds(expected.getSeconds() + SECONDS_IN_HOUR);

    await sut.setAsync(key, "");

    const actual: Date = new Date(JSON.parse(await mockStore.getItem(key)).expiration);
    expect(actual.getTime() - expected.getTime()).toBeCloseTo(0);
  });

  it("should add the key to the cache entries", async () => {
    const expected: Array<string> = [key];

    await sut.setAsync(key, "");

    const actual: Array<string> = JSON.parse(await mockStore.getItem(entriesKey));
    expect(actual).toStrictEqual(expected);
  });
});
