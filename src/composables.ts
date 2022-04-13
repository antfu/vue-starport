import type { MaybeElementRef } from '@vueuse/core'
import { unrefElement, useResizeObserver } from '@vueuse/core'
import type { EffectScope } from 'vue'
import { effectScope, reactive, watch } from 'vue'

export function useElementBounding(
  target: MaybeElementRef,
) {
  const rect = reactive({
    height: 0,
    bottom: 0,
    width: 0,
    left: 0,
    right: 0,
    top: 0,
    x: 0,
    y: 0,
    update,
    listen,
    pause,
  })

  let scope: EffectScope | undefined

  function update() {
    const el = unrefElement(target)
    if (!el)
      return
    const {
      height,
      width,
      bottom,
      left,
      right,
      top,
      x,
      y,
    } = el.getBoundingClientRect()
    Object.assign(rect, {
      height,
      width,
      bottom,
      left,
      right,
      top,
      x,
      y,
    })
  }

  function listen() {
    if (scope)
      return
    update()
    scope = effectScope()
    scope.run(() => {
      useResizeObserver(target, update)
      watch(() => unrefElement(target), ele => !ele && update())
    })
  }
  function pause() {
    scope?.stop()
    scope = undefined
  }

  return rect
}
