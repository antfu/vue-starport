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

export interface StarportProxyProps extends StarportOptions, StarportCraftProps {
}

export interface StarportProps extends StarportProxyProps {
  /**
   * Props that apply to the proxy when it is mounted.
   */
  mountedProps?: Record<string, any>
  /**
   * Props that apply to the proxy before it is mounted.
   */
  initialProps?: Record<string, any>
}
