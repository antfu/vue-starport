import type { Component } from 'vue'

export interface StarportOptions {
  duration?: number
}

export type ResolvedStarportOptions = Required<StarportOptions>

export interface StarportInstance {
  starcraft: Component
  carrier: Component
  proxy: Component
  options: StarportOptions
}
