import type { Plugin } from 'vue'
import { Starport } from './components/Starport'
import { StarportCarrier } from './components/StarportCarrier'
import { InjectionOptions } from './constants'
import type { StarportOptions } from './types'

export function StarportPlugin(defaultOptions: StarportOptions = {}): Plugin {
  return {
    install(app) {
      app.provide(InjectionOptions, defaultOptions)
      app.component('Starport', Starport)
      app.component('StarportCarrier', StarportCarrier)
    },
  }
}
