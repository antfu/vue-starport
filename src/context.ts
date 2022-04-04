import type { UseElementBoundingReturn } from '@vueuse/core'
import { useElementBounding } from '@vueuse/core'
import type { Ref } from 'vue'
import { effectScope, nextTick, reactive, ref, watch } from 'vue'
import { nanoid } from './utils'

export function createStarportContext() {
  const el: Ref<HTMLElement | undefined> = ref()
  const props: Ref<any> = ref()
  let rect: UseElementBoundingReturn = undefined!
  const scope = effectScope(true)
  const id = nanoid()

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
    props,
    rect,
    scope,
    id,
    isLanded,
    isVisible,
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
