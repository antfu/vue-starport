import type { MaybeElementRef } from '@vueuse/core'
import { unrefElement, useRafFn } from '@vueuse/core'
import type { EffectScope } from 'vue'
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
    listen,
    pause,
  })

  let scope: EffectScope | undefined
  const root = document.documentElement || document.body

  function update() {
    const el = unrefElement(target)
    if (!el)
      return
    const { height, width, left, top } = el.getBoundingClientRect()
    Object.assign(rect, { height, width, left, top: root.scrollTop + top })
  }
  const raf = useRafFn(update, { immediate: false })

  function listen() {
    if (scope)
      return
    update()
    raf.resume()
  }
  function pause() {
    raf.pause()
  }

  return rect
}
