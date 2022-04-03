import { defineComponent, renderList } from 'vue'
import { componetMap, componetMapCounter, getStarportCarrier, getStarportProxy } from './core'

export const StarportCarrier = defineComponent({
  name: 'StarportCarrier',
  render() {
    // Workaround: force renderer
    // eslint-disable-next-line no-unused-expressions
    componetMapCounter.value
    return renderList(
      Array.from(componetMap.keys()),
      (comp, idx) => h(getStarportCarrier(comp), {
        key: idx,
      }),
    )
  },
})

export const StarportProxy = defineComponent({
  name: 'StarportProxy',
  props: {
    port: {
      type: String,
    },
  },
  setup(props, ctx) {
    return () => {
      const slot = ctx.slots.default?.()
      if (!slot)
        throw new Error('StarportProxy requires a slot')
      if (slot.length !== 1)
        throw new Error(`StarportProxy requires exactly one slot, but got ${slot.length}`)
      const component = slot[0].type as any
      const proxy = getStarportProxy(component) as any
      return h(proxy, { port: props.port, props: slot[0].props })
    }
  },
})
