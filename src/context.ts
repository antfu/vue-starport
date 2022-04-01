import type { Ref } from 'vue'
import { ref } from 'vue'
import type { ResolvedStarportOptions } from './types'

export class StarportContext {
  el: Ref<HTMLElement | undefined> = ref()
  props: Ref<any> = ref()
  attrs: Ref<any> = ref()
  landed: Ref<boolean> = ref(false)
  rect: Ref<DOMRect | undefined> = ref()

  private landingTimer: any

  constructor(public options: ResolvedStarportOptions) {}

  updateRect(el = this.el.value) {
    this.rect.value = el?.getClientRects()?.[0]
  }

  liftOff() {
    this.landed.value = false
    clearTimeout(this.landingTimer)
  }

  land() {
    clearTimeout(this.landingTimer)
    this.landingTimer = setTimeout(() => {
      this.landed.value = true
    }, this.options.duration)
  }
}
