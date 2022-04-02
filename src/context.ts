import type { UseElementBoundingReturn } from '@vueuse/core'
import { nanoid } from 'nanoid'
import type { Ref, UnwrapNestedRefs } from 'vue'
import { reactive, ref } from 'vue'
import type { ResolvedStarportOptions } from './types'

export class StarportContext {
  el: Ref<HTMLElement | undefined> = ref()
  props: Ref<any> = ref()
  attrs: Ref<any> = ref()
  isLanded: Ref<boolean> = ref(false)
  rect: UnwrapNestedRefs<UseElementBoundingReturn> = undefined!
  scope = effectScope(true)
  id = nanoid()

  constructor(public options: ResolvedStarportOptions) {
    this.scope.run(() => {
      this.rect = reactive(useElementBounding(this.el))
    })
  }

  liftOff() {
    this.isLanded.value = false
    // console.log('lift up')
  }

  land() {
    this.isLanded.value = true
    // console.log('landed up')
  }
}
