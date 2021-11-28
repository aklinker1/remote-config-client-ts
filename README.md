# `@anime-skip/remote-config`

A client library for [`anime-skip/remote-config`](https://github.com/anime-skip/remote-config)

- Synchronous access
- Configurable caching

## Usage

```bash
npm i @anime-skip/remote-config
```

Then initialize the client:

```ts
import { initRemoteConfig } from '@anime-skip/remote-config';

export const remoteConfig = initRemoteConfig({
  baseUrl: 'https://remote-config.anime-skip.com',
  app: 'Anime Skip Player',
});

// Access configuration from the object
console.log(remoteConfig.someField);
```

> This library uses `fetch`, so if you're using this on a node server you'll need to install a polyfill

### Configuration

```ts
createClient({
  //...

  // Refresh the config every 60s
  interval: 60 * 1000,

  // Set an initial config while the config is loading for the first time
  defaultConfig: {
    someField: 'Some value',
  },
});
```

### Methods

#### `get()`

An alternative method for accessing the remote config:

```ts
remoteConfig.get('someField') === remoteConfig.someField;
```

> Method names can conflict with remote config fields. In that case, you can use `get(...)` to grab the value instead of accessing it directly through the `remoteConfig` object.
>
> ```ts
> remoteConfig.get('get');
> ```

#### `all()`

Get all the remote config as a plain JS object without these methods on it:

```ts
console.log(remoteConfig.all());
```

#### `waitForConfig()`

Returns a `Promise<void>` for when the remote config is loaded from the server after being initialized

```ts
await remoteConfig.waitForConfig();
// Access the values from the remote server
console.log(remoteConfig.someField);
```

#### `fetchNow()`

Fetch and cache the latest config from the server. After the promise has been resolved, you access the config through the object like usual.

```ts
await remoteConfig.fetchNow();
// Access the newer value
console.log(remoteConfig.someField);
```
