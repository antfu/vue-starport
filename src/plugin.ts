import type { Plugin } from 'vue'
import { Starport, StarportCarrier } from './components'

export function createPlugin(): Plugin {
  return {
    install(app) {
      app.component('Starport', Starport)
      app.component('StarportCarrier', StarportCarrier)
    },
  }
}
