import type { UseElementBoundingReturn } from '@vueuse/core'
import { useElementBounding } from '@vueuse/core'
import type { Ref } from 'vue'
import { computed, effectScope, nextTick, reactive, ref, watch } from 'vue'
import { defaultOptions } from './options'
import type { ResolvedStarportOptions, StarportOptions } from './types'
import { nanoid } from './utils'

export function createStarportContext(
  port: string,
  inlineOptions: StarportOptions = {},
) {
  const el: Ref<HTMLElement | undefined> = ref()
  const props: Ref<any> = ref()
  const isLanded: Ref<boolean> = ref(false)
  const scope = effectScope(true)
  const id = nanoid()
  const localOptions = ref<StarportOptions>({})
  const options = computed<ResolvedStarportOptions>(() => ({
    ...defaultOptions,
    ...inlineOptions,
    ...localOptions.value,
  }))

  let rect: UseElementBoundingReturn = undefined!

  scope.run(() => {
    rect = useElementBounding(el, { reset: false })
  })

  return reactive({
    el,
    port,
    props,
    rect,
    scope,
    id,
    isLanded,
    options,
    setLocalOptions(options: StarportOptions = {}) {
      localOptions.value = JSON.parse(JSON.stringify(options))
    },
    land() {
      isLanded.value = true
    },
    liftOff() {
      isLanded.value = false
    }
  })
}

export type StarportContext = ReturnType<typeof createStarportContext>
