import { reactive } from 'vue'
import type { Component } from 'vue'
import type { StarportOptions } from './types'
import type { StarportContext } from './context'
import { createStarportContext } from './context'

export function createInternalState(options: StarportOptions) {
  const portMap = reactive(new Map<string, StarportContext>())

  function getContext(port: string, component: Component) {
    let context = portMap.get(port)
    if (!context) {
      context = createStarportContext(port, component, options)
      portMap.set(port, context)
    }
    else if (context.component !== component) {
      throw new Error(`[Vue Starport] Port "${port}" is already used by "${context.componentName}"`)
    }
    return context
  }

  return {
    portMap,
    getContext,
  }
}

export type InternalState = ReturnType<typeof createInternalState>
