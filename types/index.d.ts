import san from 'san';

type Component = san.SanComponentConfig<{}, {}> & {
  [k: string]: any
} | Function | (() => Promise<any>)

type Dictionary<T> = { [key: string]: T }

type Query = Dictionary<string | (string | null)[] | null | undefined>

type Mode = 'hash' | 'history'

interface Config {
  rule: string | RegExp
  handler?(e: HandlerArgs): any
  Component?: Component
  target?: string
}

// this.routes
interface RouterItem extends Config {
  id: string
  keys: Array<string | any>
  config: Config
}

interface Location {
  path: string
  hash?: string
  query?: Query
  params?: Dictionary<string>
  queryString?: string
}

class EventTarget {
  on(type: string, fn: Function): void
  un(type: string, fn?: Function): void
  fire(type: string, args?: any[])
}

class Locator extends EventTarget {
  current: string
  referrer: string

  start(): void
  stop(): void

  redirect(url: string, options?: {
    force?: boolean,
    silent?: boolean
  }): void
  reload(): void
}

interface ListenerArgs extends Location {
  url: string
  referrer: string,
  config: Config,
  resume(): void
  suspend(): void
  stop(): void
}

interface HandlerArgs extends Location {
  referrer: string,
  config: Config,
}

export const Link: Component

export const router: Router

export class HashLocator extends Locator { }
export class HTML5Locator extends Locator {
  isSupport: boolean
}

export function resolveURL(source: Array<string>, base: Array<string>): string
export function parseURL(url: string): Location
export function stringifyURL(source: Location): string

export class Router {
  mode: Mode

  routes: Array<RouterItem> | [];
  listeners: Array<Function> | [];

  locator: HashLocator | HTML5Locator

  listen(listener: (e: ListenerArgs, config?: Config) => any): void
  unlisten(listener: (e: ListenerArgs, config?: Config) => any): void

  start(): void
  stop(): void

  setMode(mode: Mode): router

  push(options: Location): void
  push(options: string): void

  add(config: Config): router
}

export const version = '1.2.3'
