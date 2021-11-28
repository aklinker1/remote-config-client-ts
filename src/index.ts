export interface RemoteConfigOptions<T> {
  baseUrl: string;
  app: string;
  /**
   * Default config while it is loading from the server
   */
  default?: T;
  /**
   * The interval in milliseconds that the cache is reloaded after.
   *
   * @default 1 hour
   */
  interval?: number;
  /**
   * A custom implementation of `console.warn`
   */
  warn?: typeof console.warn;
}

interface RemoteConfigClient<T> {
  get(field: keyof T): any;
  all(): Readonly<T>;
  waitForConfig(): Promise<void>;
  fetchNow(): Promise<void>;
}

export type RemoteConfig<T> = Readonly<T> & RemoteConfigClient<T>;

export function initRemoteConfig<T = {}>(options: RemoteConfigOptions<T>): RemoteConfig<T> {
  async function load() {
    try {
      const response = await fetch(`${options.baseUrl}/api/config/${options.app}`);
      const body = await response.json();
      if (response.status !== 200) {
        warn(`Failed to get remote config with status ${response.status}`, { body });
        return;
      }
      config._ = Object.assign({}, body);
    } catch (err) {
      warn('Failed to load remote config', err);
    }
  }

  const warn = options.warn ?? console.warn;
  const config: { _: T } = { _: options.default ?? ({} as T) };
  const initialPromise = load();
  const client: RemoteConfigClient<T> = {
    get: field => config._[field],
    all: () => Object.assign({}, config._),
    fetchNow: load,
    waitForConfig: () => initialPromise,
  };

  setInterval(load, options.interval ?? 60 * 60 * 1000);

  return new Proxy<RemoteConfig<T>>(client as RemoteConfig<T>, {
    get(target, field) {
      // @ts-expect-error: Completely disregard types here, they're not helpful
      return target[field] ?? config._[field];
    },
  });
}
