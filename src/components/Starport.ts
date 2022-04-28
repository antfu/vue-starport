import { isObject } from '@vueuse/core'
import type { DefineComponent } from 'vue'
import { defineComponent, h, inject, isVNode, markRaw, onMounted, watch } from 'vue'
import { InjectionGlobalState, InjectionState } from '../constants'
import { proxyProps } from '../options'
import type { StarportProps } from '../types'
import { StarportProxy } from './StarportProxy'

/**
 * The proxy component wrapper for the Starport.
 */
export const Starport = defineComponent({
  name: 'Starport',
  inheritAttrs: true,
  props: proxyProps,
  setup(props, ctx) {
    const globalState = inject(InjectionGlobalState)
    if (!globalState)
      return
    const { isCarrierReady } = globalState

    function init() {
      const state = inject(InjectionState)

      if (!state)
        throw new Error('[Vue Starport] Failed to find <StarportCarrier>, have you initialized it?')
    }

    const _unWatch = watch(() => isCarrierReady, nVal => nVal && init())

    onMounted(() => {
      // avoiding forgeting to create <StarportCarrier> component
      setTimeout(() => {
        if (!isCarrierReady.value)
          init()

        _unWatch()
      })
    })

    return () => {
      if (!isCarrierReady.value)
        return null

      const slots = ctx.slots.default?.()

      if (!slots)
        throw new Error('[Vue Starport] Slot is required to use <Starport>')
      if (slots.length !== 1)
        throw new Error(`[Vue Starport] <Starport> requires exactly one slot, but got ${slots.length}`)

      const slot = slots[0]
      let component = slot.type as any

      if (!isObject(component) || isVNode(component)) {
        component = {
          render() {
            return slots
          },
        }
      }

      return h(StarportProxy, {
        ...props,
        key: props.port,
        component: markRaw(component),
        props: slot.props,
      })
    }
  },
}) as DefineComponent<StarportProps>
