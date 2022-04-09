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
   * // TODO:
   * @todo
   * @default true
   */
  keepAlive?: boolean
}

export type ResolvedStarportOptions = Required<StarportOptions>

export interface StarportComponents {
  // TODO: proper type them
  /**
   * The flying component
   */
  starcraft: Component
  /**
   * Holds all flying instance of the component
   */
  board: Component
  /**
   * The proxy component
   */
  proxy: Component
  options: StarportOptions
}
