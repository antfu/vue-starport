import type { Plugin } from 'vue'
import { Starport } from './components/Starport'
import { StarportCarrier } from './components/StarportCarrier'
import { InjectionGlobalState, InjectionOptions } from './constants'
import { createGlobalState } from './state'
import type { StarportOptions } from './types'

export function StarportPlugin(defaultOptions: StarportOptions = {}): Plugin {
  return {
    install(app) {
      app.provide(InjectionGlobalState, createGlobalState())
      app.provide(InjectionOptions, defaultOptions)
      app.component('Starport', Starport)
      app.component('StarportCarrier', StarportCarrier)
    },
  }
}
