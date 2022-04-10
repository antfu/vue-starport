import type { Plugin } from 'vue'
import { Starport, StarportCarrier } from './components'
import { InjectionOptions } from './constants'
import type { StarportOptions } from './types'

export function createPlugin(defaultOptions: StarportOptions = {}): Plugin {
  return {
    install(app) {
      app.provide(InjectionOptions, defaultOptions)
      app.component('Starport', Starport)
      app.component('StarportCarrier', StarportCarrier)
    },
  }
}
