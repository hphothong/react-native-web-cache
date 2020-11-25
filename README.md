# react-native-web-cache

## Installation

```sh
npm install --save react-native-web-cache
yarn add react-native-web-cache
bower install --save react-native-web-cache
```

## Usage

### JavaScript

```javascript
var webCache = require("react-native-web-cache");
var cacheOptions = { capacity: 10 };
var cache = new webCache.Cache(cacheOptions);

async function() {
  await cache.setAsync("key", 42);
  var value = await cache.getAsync("key"); // value = 42
}
```

### TypeScript

```typescript
import { Cache, ICache, ICacheOptions } from "react-native-web-cache";
const cacheOptions: ICacheOptions = { capacity: 10 };
const cache: ICache = new Cache(cacheOptions);

const asyncFunction = async (): Promise<void> => {
  cache.setAsync<number>("key", 42).then((): void => {
    cache.getAsync<number>("key").then((value: number): number => value); // value = 42
  });
};
```
