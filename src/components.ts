import { isObject } from '@vueuse/core'
import type { Component, InjectionKey } from 'vue'
import { defineComponent, getCurrentInstance, h, inject, isVNode, ref, renderList } from 'vue'
import { createStarport } from './core'
import { optionsProps } from './options'
import type { StarportComponents } from './types'

const ProvideSymbol = Symbol('Starport') as InjectionKey<ReturnType<typeof createInternalState>>

function createInternalState() {
  const componetMapCounter = ref(0)
  const componetMap = new Map<Component, StarportComponents>()

  function getStarportInstance(componet: Component) {
    if (!componetMap.has(componet)) {
      componetMapCounter.value += 1
      componetMap.set(componet, createStarport(componet))
    }
    return componetMap.get(componet)!
  }

  function toStarportProxy<T extends Component>(componet: T) {
    return getStarportInstance(componet).proxy
  }

  function toStarportBoard<T extends Component>(componet: T): Component {
    return getStarportInstance(componet)!.board
  }

  return {
    componetMapCounter,
    componetMap,
    toStarportProxy,
    toStarportBoard,
  }
}

/**
 * The carrier component for all the flying Starport components
 * Should be intialized in App.vue only once.
 */
export const StarportCarrier = defineComponent({
  name: 'StarportCarrier',
  setup() {
    const state = createInternalState()
    const app = getCurrentInstance()!.appContext.app
    app.provide(ProvideSymbol, state)

    return () => {
      // Workaround: force renderer
      // eslint-disable-next-line no-unused-expressions
      state.componetMapCounter.value
      return renderList(
        Array.from(state.componetMap.keys()),
        (comp, idx) => h(
          state.toStarportBoard(comp) as any,
          { key: idx },
        ),
      )
    }
  },
})

/**
 * The proxy component warpper for the Starport.
 */
export const Starport = defineComponent({
  name: 'Starport',
  inheritAttrs: true,
  props: {
    port: {
      type: String,
      required: false,
    },
    ...optionsProps,
  },
  setup(props, ctx) {
    const state = inject(ProvideSymbol)

    if (!state)
      throw new Error('[Vue Starport] Failed to find <StarportCarrier>, have you initalized it?')

    return () => {
      const slots = ctx.slots.default?.()

      if (!slots)
        throw new Error('[Vue Starport] Slot is required to use <Starport>')
      if (slots.length !== 1)
        throw new Error(`[Vue Starport] <Starport> requires exactly one slot, but got ${slots.length}`)

      const slot = slots[0]
      const component = slot.type as any

      if (!isObject(component) || isVNode(component))
        throw new Error('[Vue Starport] The slot in <Starport> must be a component')

      const proxy = state.toStarportProxy(component) as any
      return h(proxy, {
        ...props,
        port: props.port,
        props: slot.props,
        key: props.port,
      })
    }
  },
})
