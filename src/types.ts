import type { Component } from 'vue'

export interface StarportOptions {
  duration?: number
}

export type ResolvedStarportOptions = Required<StarportOptions>

export interface StarportInstance<T extends Component = Component> {
  component: T
  container: T
  proxy: T
  options: StarportOptions
}
