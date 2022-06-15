import { computed, effectScope, nextTick, reactive, ref, watch } from 'vue'
import type { Component, Ref } from 'vue'
import { useElementBounding } from './composables'
import { defaultOptions } from './options'
import type { ResolvedStarportOptions, StarportOptions } from './types'
import { getComponentName, kebabCase, nanoid } from './utils'

/**
 * @internal
 */
export function createStarportInstance(
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
  const liftOffTime = ref(0)

  let rect: ReturnType<typeof useElementBounding> = undefined!

  scope.run(() => {
    rect = useElementBounding(el)
    watch(el, async (v) => {
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
    liftOffTime,
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
      liftOffTime.value = Date.now()
      rect.listen()
      // console.log('lift off', port)
    },
    land() {
      if (isLanded.value)
        return
      isLanded.value = true
      rect.pause()
      // console.log('land', port)
    },
  })
}

export type StarportInstance = ReturnType<typeof createStarportInstance>
