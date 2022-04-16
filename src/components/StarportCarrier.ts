import type { DefineComponent } from 'vue'
import { defineComponent, getCurrentInstance, h, inject } from 'vue'
import { InjectionOptions, InjectionState } from '../constants'
import { createInternalState } from '../state'
import { StarportCraft } from './StarportCraft'

/**
 * The carrier component for all the flying Starport components
 * Should be initialized in App.vue only once.
 */
export const StarportCarrier = defineComponent({
  name: 'StarportCarrier',
  setup(_, { slots }) {
    const state = createInternalState(inject(InjectionOptions, {}))
    const app = getCurrentInstance()!.appContext.app
    app.provide(InjectionState, state)

    return () => {
      return [
        slots.default?.(),
        Array.from(state.portMap.entries())
          .map(([port, { component }]) => h(
            StarportCraft,
            { key: port, port, component },
          )),
      ]
    }
  },
}) as DefineComponent<{}>
