import type { UseElementBoundingReturn } from '@vueuse/core'
import { useElementBounding } from '@vueuse/core'
import type { Ref } from 'vue'
import { computed, effectScope, reactive, ref, watch } from 'vue'
import { defaultOptions } from './options'
import type { ResolvedStarportOptions, StarportOptions } from './types'
import { kebabCase, nanoid } from './utils'

/**
 * @internal
 */
export function createStarportContext(
  componentId: string,
  port: string,
  inlineOptions: StarportOptions = {},
) {
  const el: Ref<HTMLElement | undefined> = ref()
  const props: Ref<any> = ref(null)
  const isLanded: Ref<boolean> = ref(false)
  const isVisible = ref(false)
  const scope = effectScope(true)
  const localOptions = ref<StarportOptions>({})
  const options = computed<ResolvedStarportOptions>(() => ({
    ...defaultOptions,
    ...inlineOptions,
    ...localOptions.value,
  }))

  let rect: UseElementBoundingReturn = undefined!

  scope.run(() => {
    rect = useElementBounding(el, { reset: false })
    watch(el, (v: any) => {
      if (v)
        isVisible.value = true
      if (!el.value)
        isVisible.value = false
    })
  })

  function generateId() {
    return `starport-${componentId}-${kebabCase(port)}-${nanoid()}`
  }

  const id = generateId()

  return reactive({
    el,
    id,
    port,
    props,
    rect,
    scope,
    isLanded,
    isVisible,
    options,
    generateId,
    setLocalOptions(options: StarportOptions = {}) {
      localOptions.value = JSON.parse(JSON.stringify(options))
    },
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
