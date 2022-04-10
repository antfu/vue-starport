import { shallowReactive } from 'vue'
import type { Component } from 'vue'
import { createStarport } from './core'
import type { StarportComponents, StarportOptions } from './types'

export function createInternalState(options: StarportOptions) {
  const componentMap = shallowReactive(new Map<Component, StarportComponents>())

  function getStarportInstance(component: Component) {
    if (!componentMap.has(component))
      componentMap.set(component, createStarport(component, options))
    return componentMap.get(component)!
  }

  function toStarportProxy<T extends Component>(component: T) {
    return getStarportInstance(component).proxy
  }

  function toStarportBoard<T extends Component>(component: T): Component {
    return getStarportInstance(component)!.board
  }

  return {
    componentMap,
    toStarportProxy,
    toStarportBoard,
  }
}
