import { shallowReactive } from 'vue'
import type { Component } from 'vue'
import { createStarport } from './core'
import type { StarportComponents, StarportOptions } from './types'

export function createInternalState(options: StarportOptions) {
  const componetMap = shallowReactive(new Map<Component, StarportComponents>())

  function getStarportInstance(componet: Component) {
    if (!componetMap.has(componet))
      componetMap.set(componet, createStarport(componet, options))
    return componetMap.get(componet)!
  }

  function toStarportProxy<T extends Component>(componet: T) {
    return getStarportInstance(componet).proxy
  }

  function toStarportBoard<T extends Component>(componet: T): Component {
    return getStarportInstance(componet)!.board
  }

  return {
    componetMap,
    toStarportProxy,
    toStarportBoard,
  }
}
