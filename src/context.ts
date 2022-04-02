import type { UseElementBoundingReturn } from '@vueuse/core'
import { customAlphabet } from 'nanoid'
import type { Ref } from 'vue'
import { reactive, ref, watch } from 'vue'

const getId = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)

export function createStarportContext() {
  const el: Ref<HTMLElement | undefined> = ref()
  const props: Ref<any> = ref()
  const attrs: Ref<any> = ref()
  let rect: UseElementBoundingReturn = undefined!
  const scope = effectScope(true)
  const id = getId()

  const isLanded: Ref<boolean> = ref(false)
  const isVisible = ref(false)

  scope.run(() => {
    rect = useElementBounding(el)
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
    attrs,
    rect,
    scope,
    id,
    isLanded,
    isVisible,
    elRef() {
      return el
    },
    async liftOff() {
      if (!isLanded.value)
        return
      isLanded.value = false
    },
    async land() {
      if (isLanded.value)
        return
      isLanded.value = true
    },
  })
}

export type StarportContext = ReturnType<typeof createStarportContext>
