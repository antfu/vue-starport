import type { Component } from 'vue'

export interface StarportOptions {
  duration?: number
  landing?: boolean
}

export type ResolvedStarportOptions = Required<StarportOptions>

export interface StarportInstance<T extends Component = Component> {
  component: T
  container: T
  proxy: T
  options: StarportOptions
}
