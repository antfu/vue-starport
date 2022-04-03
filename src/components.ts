import type { Component } from 'vue'
import { defineComponent, h, ref, renderList } from 'vue'
import { createStarport } from './core'
import type { StarportInstance } from './types'

const componetMapCounter = ref(0)
const componetMap = new Map<Component, StarportInstance>()

export function getStarport<T extends Component>(componet: T) {
  if (!componetMap.has(componet)) {
    componetMapCounter.value += 1
    componetMap.set(componet, createStarport(componet))
  }
  return componetMap.get(componet)!.proxy
}

export function getStarportCarrier<T extends Component>(componet: T): Component {
  if (!componetMap.has(componet)) {
    componetMapCounter.value += 1
    componetMap.set(componet, createStarport(componet))
  }
  return componetMap.get(componet)!.carrier
}

export const StarportCarrier = defineComponent({
  name: 'StarportCarrier',
  render() {
    // Workaround: force renderer
    // eslint-disable-next-line no-unused-expressions
    componetMapCounter.value
    return renderList(
      Array.from(componetMap.keys()),
      (comp, idx) => h(getStarportCarrier(comp) as any, {
        key: idx,
      }),
    )
  },
})

export const Starport = defineComponent({
  name: 'Starport',
  props: {
    port: {
      type: String,
    },
  },
  setup(props, ctx) {
    return () => {
      const slot = ctx.slots.default?.()
      if (!slot)
        throw new Error('Starport requires a slot')
      if (slot.length !== 1)
        throw new Error(`Starport requires exactly one slot, but got ${slot.length}`)
      const component = slot[0].type as any
      const proxy = getStarport(component) as any
      return h(proxy, { port: props.port, props: slot[0].props })
    }
  },
})
