import { isObject } from '@vueuse/core'
import type { Component } from 'vue'
import { defineComponent, h, isVNode, ref, renderList } from 'vue'
import { createStarport } from './core'
import { optionsProps } from './options'
import type { StarportInstance } from './types'

const componetMapCounter = ref(0)
const componetMap = new Map<Component, StarportInstance>()

function getStarportInstance(componet: Component) {
  if (!componetMap.has(componet)) {
    componetMapCounter.value += 1
    componetMap.set(componet, createStarport(componet))
  }
  return componetMap.get(componet)!
}

export function toStarportProxy<T extends Component>(componet: T) {
  return getStarportInstance(componet).proxy
}

export function toStarportCarrier<T extends Component>(componet: T): Component {
  return getStarportInstance(componet)!.carrier
}

export const StarportCarrier = defineComponent({
  name: 'StarportCarrier',
  render() {
    // Workaround: force renderer
    // eslint-disable-next-line no-unused-expressions
    componetMapCounter.value
    return renderList(
      Array.from(componetMap.keys()),
      (comp, idx) => h(
        toStarportCarrier(comp) as any,
        { key: idx },
      ),
    )
  },
})

export const Starport = defineComponent({
  name: 'Starport',
  props: {
    port: {
      type: String,
      required: false,
    },
    ...optionsProps,
  },
  setup(props, ctx) {
    return () => {
      const slots = ctx.slots.default?.()
      if (!slots)
        throw new Error('Slot is required for Starport')
      if (slots.length !== 1)
        throw new Error(`Starport requires exactly one slot, but got ${slots.length}`)
      const slot = slots[0]
      const component = slot.type as any
      if (!isObject(component) || isVNode(component))
        throw new Error('The slot in Starport must be a component')
      const proxy = toStarportProxy(component) as any
      return h(proxy, {
        ...props,
        port: props.port,
        props: slot.props,
        key: props.port,
      })
    }
  },
})
