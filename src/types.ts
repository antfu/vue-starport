import type { Component } from 'vue'

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
   * @default true
   */
  keepAlive?: boolean
}

export type ResolvedStarportOptions = Required<StarportOptions>

export interface StarportInstance {
  starcraft: Component
  carrier: Component
  proxy: Component
  options: StarportOptions
}
