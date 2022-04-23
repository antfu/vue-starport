import type { MaybeElementRef } from '@vueuse/core'
import { unrefElement } from '@vueuse/core'
import { reactive } from 'vue'

export function useElementBounding(
  target: MaybeElementRef,
) {
  const rect = reactive({
    height: 0,
    width: 0,
    left: 0,
    top: 0,
    update,
  })

  const root = document.documentElement || document.body

  function update() {
    const el = unrefElement(target)
    if (!el)
      return
    const { height, width, left, top } = el.getBoundingClientRect()
    Object.assign(rect, { height, width, left, top: root.scrollTop + top })
  }

  return rect
}
