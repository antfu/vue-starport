import type { UseElementBoundingReturn } from '@vueuse/core'
import { useElementBounding } from '@vueuse/core'
import type { Ref } from 'vue'
import { effectScope, nextTick, reactive, ref, watch } from 'vue'
import { defaultOptions } from './options'
import type { StarportOptions } from './types'
import { nanoid } from './utils'

export function createStarportContext(
  port: string,
  options: StarportOptions = {},
) {
  const el: Ref<HTMLElement | undefined> = ref()
  const props: Ref<any> = ref()
  let rect: UseElementBoundingReturn = undefined!
  const scope = effectScope(true)
  const id = nanoid()
  const resolved = {
    ...defaultOptions,
    ...options,
  }

  const isLanded: Ref<boolean> = ref(false)
  const isVisible = ref(false)

  scope.run(() => {
    rect = useElementBounding(el, { reset: false })
    watch(el, async(v) => {
      if (v)
        isVisible.value = true
      await nextTick()
      if (!el.value)
        isVisible.value = false
    })
  })

  return reactive({
    el,
    port,
    props,
    rect,
    scope,
    id,
    isLanded,
    isVisible,
    options: resolved,
    elRef() {
      return el
    },
    liftOff() {
      if (!isLanded.value)
        return
      isLanded.value = false
    },
    land() {
      if (isLanded.value)
        return
      isLanded.value = true
    },
  })
}

export type StarportContext = ReturnType<typeof createStarportContext>
