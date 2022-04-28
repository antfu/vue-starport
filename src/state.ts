import { computed, reactive, ref } from 'vue'
import type { Component } from 'vue'
import type { StarportOptions } from './types'
import type { StarportInstance } from './instance'
import { createStarportInstance } from './instance'

export function createInternalState(options: StarportOptions) {
  const portMap = reactive(new Map<string, StarportInstance>())

  function getInstance(port: string, component: Component) {
    let context = portMap.get(port)
    if (!context) {
      context = createStarportInstance(port, component, options)
      portMap.set(port, context)
    }
    context.component = component
    return context
  }

  function dispose(port: string) {
    portMap.get(port)?.scope.stop()
    portMap.delete(port)
  }

  return {
    portMap,
    dispose,
    getInstance,
  }
}
export type InternalState = ReturnType<typeof createInternalState>

export function createGlobalState() {
  const _isCarrierReady = ref(false)

  function ready() {
    _isCarrierReady.value = true
  }

  const isCarrierReady = computed(() => _isCarrierReady.value || false)

  return {
    isCarrierReady,
    ready,
  }
}

export type GlobalState = ReturnType<typeof createGlobalState>
