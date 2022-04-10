import type { UseElementBoundingReturn } from '@vueuse/core'
import { useElementBounding } from '@vueuse/core'
import type { Component, Ref } from 'vue'
import { computed, effectScope, reactive, ref, watch } from 'vue'
import { defaultOptions } from './options'
import type { ResolvedStarportOptions, StarportOptions } from './types'
import { getComponentName, kebabCase, nanoid } from './utils'

/**
 * @internal
 */
export function createStarportContext(
  port: string,
  component: Component,
  inlineOptions: StarportOptions = {},
) {
  const componentName = getComponentName(component)
  const componentId = kebabCase(componentName) || nanoid()

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
    watch(el, async(v) => {
      if (v)
        isVisible.value = true
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
    component,
    componentName,
    componentId,
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
