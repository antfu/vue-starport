import type { UseElementBoundingReturn } from '@vueuse/core'
import { customAlphabet } from 'nanoid'
import type { Ref } from 'vue'
import { reactive, ref } from 'vue'

const getId = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)

export function createStarportContext() {
  const el: Ref<HTMLElement | undefined> = ref()
  const props: Ref<any> = ref()
  const attrs: Ref<any> = ref()
  const isLanded: Ref<boolean> = ref(false)
  let rect: UseElementBoundingReturn = undefined!
  const scope = effectScope(true)
  const id = getId()

  scope.run(() => {
    rect = useElementBounding(el)
  })

  return reactive({
    el,
    props,
    attrs,
    isLanded,
    rect,
    scope,
    id,
    elRef() {
      return el
    },
    updateRect() {
      rect.update()
    },
    liftOff() {
      rect.update()
      isLanded.value = false
      // console.log('lift up')
    },
    land() {
      isLanded.value = true
    // console.log('landed up')
    },
  })
}

export type StarportContext = ReturnType<typeof createStarportContext>
