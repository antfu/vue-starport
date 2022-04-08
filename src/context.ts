import type { UseElementBoundingReturn } from '@vueuse/core'
import { useElementBounding } from '@vueuse/core'
import type { Ref } from 'vue'
import { computed, effectScope, nextTick, reactive, ref, watch } from 'vue'
import { defaultOptions } from './options'
import type { ResolvedStarportOptions, StarportOptions } from './types'
import { kebabCase, nanoid } from './utils'

export function createStarportContext(
  componentId: string,
  port: string,
  inlineOptions: StarportOptions = {},
) {
  const el: Ref<HTMLElement | undefined> = ref()
  const props: Ref<any> = ref()
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
    watch(el, async(v) => {
      if (v)
        isVisible.value = true
      await nextTick()
      if (!el.value)
        isVisible.value = false
    })
  })

  const portId = kebabCase(port)
  function generateId() {
    return `starport-${componentId}-${portId}-${nanoid()}`
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
