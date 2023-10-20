import type { ComponentDefineOptions} from 'san';

type Component = ComponentDefineOptions & {
  [k: string]: any
} | Function | (() => Promise<any>);

type Dictionary<T> = { [key: string]: T };

type Query = Dictionary<string | (string | null)[] | null | undefined>;

type Mode = 'hash' | 'history';

interface RouteConfig {
  rule: string | RegExp;
  handler?(e: RouteInfo): any;
  Component?: Component;
  target?: string;
}

// this.routes
interface RouterItem {
  id: string;
  keys: Array<string | any>;
  rule: RegExp;
  handler?(e: RouteInfo): any;
  Component?: Component;
  target?: string;
  config: RouteConfig;
}

interface Location {
  path: string;
  hash?: string;
  query?: Query;
  params?: Dictionary<string>;
  queryString?: string;
}

interface RedirectOptions {
  force?: boolean;
  silent?: boolean;
  replace?: boolean;
}

declare class EventTarget {
  on(type: string, fn: Function): void;
  un(type: string, fn?: Function): void;
  fire(type: string, args?: any[]);
}

declare class Locator extends EventTarget {
  current: string;
  referrer: string;

  start(): void;
  stop(): void;

  redirect(url: string, options?: RedirectOptions): void;
  reload(): void;
}

interface ListenerArgs extends Location {
  url: string;
  referrer: string;
  config: RouteConfig;
  resume(): void;
  suspend(): void;
  stop(): void;
}


interface RouteInfo extends Location {
    referrer: string;
}

export const Link: Component;

export const router: Router;

export class HashLocator extends Locator { }
export class HTML5Locator extends Locator {
  isSupport: boolean
}

export function resolveURL(source: Array<string>, base: Array<string>): string
export function parseURL(url: string): Location
export function stringifyURL(source: Location): string

export class Router {
  mode: Mode;

  routes: Array<RouterItem> | [];
  listeners: Array<Function> | [];

  locator: HashLocator | HTML5Locator

  listen(listener: (e: ListenerArgs, config?: RouteConfig) => any): void;
  unlisten(listener: (e: ListenerArgs, config?: RouteConfig) => any): void;

  start(): void;
  stop(): void;

  setMode(mode: Mode): Router;

  push(url: Location, options?: RedirectOptions): void;
  push(url: string, options?: RedirectOptions): void;

  replace(url: Location, options?: RedirectOptions): void;
  replace(url: string, options?: RedirectOptions): void;

  add(config: RouteConfig | RouteConfig[]): Router;
}

export const version = '2.0.2';
