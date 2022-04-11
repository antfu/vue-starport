export interface StarportOptions {
  /**
   * The duration of the animation in milliseconds.
   * @default 600
   */
  duration?: number
  /**
   * Easing function to use.
   * @see https://easings.net/
   * @default 'cubic-bezier(0.45, 0, 0.55, 1)'
   */
  easing?: string
  /**
   * Should keep the component alive if no proxy is presented
   *
   * @default false
   */
  keepAlive?: boolean
}

export type ResolvedStarportOptions = Required<StarportOptions>

export interface StarportCraftProps {
  /**
   * The id of the starport instance across routes
   */
  port: string
}

export interface StarportProps extends StarportOptions, StarportCraftProps {
}

export interface IterableIterator {
  next: () => {
    value: [string, any]
    done: boolean
  }
  [Symbol.iterator](): IterableIterator
}
