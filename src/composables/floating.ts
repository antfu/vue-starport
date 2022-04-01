import type { Component, StyleValue } from 'vue'
import { Teleport, h } from 'vue'

export interface FloatingOptions {
  duration?: number
  landing?: boolean
}

export function createFloating<T extends Component>(
  component: T,
  options?: FloatingOptions,
) {
  const {
    duration = 1000,
    // TODO: fix teleports
    landing = false,
  } = options || {}
  const metadata = reactive<any>({
    props: {},
    attrs: {},
  })
  const proxyEl = ref<HTMLElement | null>()
  // const id = nanoid()

  let timer: any
  let isLanded = $ref(true)

  function liftOff() {
    isLanded = false
    clearTimeout(timer)
  }

  function land() {
    clearTimeout(timer)
    timer = setTimeout(() => {
      isLanded = true
    }, duration * 3)
  }

  let rect = $ref<DOMRect | undefined>()

  function update(el = proxyEl.value) {
    rect = el?.getClientRects()?.[0]
  }

  const container = defineComponent({
    setup() {
      const style = computed((): StyleValue => {
        const fixed: StyleValue = {
          transition: `all ${duration}ms ease-in-out`,
          position: 'fixed',
        }
        if (!rect || !proxyEl.value) {
          return {
            opacity: 0,
            pointerEvents: 'none',
          }
        }
        return {
          ...fixed,
          left: `${rect.x ?? 0}px`,
          top: `${rect.y ?? 0}px`,
        }
      })

      useMutationObserver(proxyEl, () => update(), {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      })
      useEventListener('resize', () => update())
      watchEffect(() => update())

      return () => {
        const comp = h(component, metadata.attrs)
        const teleports = !!(landing && isLanded && proxyEl.value)
        return h(
          'div',
          { style: style.value, class: 'floating-container' },
          [
            teleports
              ? h(Teleport, {
                to: proxyEl.value,
                disabled: teleports,
              },
              [comp])
              : comp,
          ],
        )
      }
    },
  }) as T

  const proxy = defineComponent({
    setup(props, ctx) {
      const attrs = useAttrs()
      const el = ref<HTMLElement>()

      metadata.attrs = attrs

      onMounted(() => {
        proxyEl.value = el.value
        update(el.value)
        land()
      })

      onBeforeUnmount(() => {
        update(el.value)
        liftOff()
        // TODO: fixme
        // proxyEl.value = undefined
      })

      return () => h('div', { ref: el, class: 'floating-proxy' }, [
        ctx.slots.default
          ? h(ctx.slots.default)
          : null,
      ])
    },
  }) as T

  return {
    container,
    proxy,
  }
}
