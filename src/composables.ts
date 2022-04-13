import type { MaybeElementRef } from '@vueuse/core'
import { unrefElement } from '@vueuse/core'
import { reactive } from 'vue'

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
  })

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

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop

    Object.assign(rect, {
      height,
      width,
      bottom,
      left,
      right,
      top,
      x,
      y: scrollTop + y,
    })
  }

  return rect
}