import type { Plugin } from 'vue'
import { Starport, StarportCarrier } from './components'

export const plugin: Plugin = {
  install(app) {
    app.component('Starport', Starport)
    app.component('StarportCarrier', StarportCarrier)
  },
}
