import type { MaybeElementRef } from '@vueuse/core'
import { isClient, unrefElement, useRafFn } from '@vueuse/core'
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
    margin: '0px',
    padding: '0px',
  })

  let scope: EffectScope | undefined
  const root = isClient ? (document.documentElement || document.body) : undefined

  function update() {
    if (!isClient)
      return
    const el = unrefElement(target)
    if (!el)
      return
    const { height, width, left, top } = el.getBoundingClientRect()
    const domStyle = window.getComputedStyle(el)
    const margin = domStyle.margin
    const padding = domStyle.padding
    Object.assign(rect, { height, width, left, top: root!.scrollTop + top, margin, padding })
  }
  const raf = useRafFn(update, { immediate: false })

  function listen() {
    if (!isClient)
      return
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
