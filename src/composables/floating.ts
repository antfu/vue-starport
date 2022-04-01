import { nanoid } from 'nanoid'
import type { Component, Ref, StyleValue } from 'vue'
import { Teleport, h } from 'vue'

export interface StarportOptions {
  duration?: number
  landing?: boolean
}

export type ResolvedStarportOptions = Required<StarportOptions>

export interface StarportInstance {
  component: Component
  container: Component
  proxy: Component
  options: StarportOptions
}

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

export function createStarport<T extends Component>(
  component: T,
  options: StarportOptions = {},
) {
  const resolved: ResolvedStarportOptions = {
    duration: 800,
    // TODO: fix teleports
    landing: false,
    ...options,
  }

  const defaultId = nanoid()
  const contextMap = new Map<string, StarportContext>()

  function getContext(port = defaultId) {
    if (!contextMap.has(port))
      contextMap.set(port, new StarportContext(resolved))
    return contextMap.get(port)!
  }

  const container = defineComponent({
    props: {
      port: {
        type: String,
        default: defaultId,
      },
    },
    setup(props) {
      const context = $computed(() => getContext(props.port))
      const { rect, el: proxyEl, attrs } = $(context)

      const style = computed((): StyleValue => {
        const fixed: StyleValue = {
          transition: `all ${resolved.duration}ms ease-in-out`,
          position: 'fixed',
        }
        if (!rect || !proxyEl) {
          return {
            opacity: 0,
            pointerEvents: 'none',
          }
        }
        return {
          ...fixed,
          left: `${rect.x ?? 0}px`,
          top: `${rect.y ?? 0}px`,
          width: `${rect.width ?? 0}px`,
          height: `${rect.height ?? 0}px`,
        }
      })

      useMutationObserver(context.el, () => context.updateRect(), {
        attributes: true,
      })
      useEventListener('resize', () => context.updateRect())
      watchEffect(() => context.updateRect())

      return () => {
        const comp = h(component, attrs)
        const teleports = false // TODO:
        return h(
          'div',
          {
            style: style.value,
            class: 'starport-container',
          },
          [
            teleports
              ? h(Teleport, {
                to: proxyEl,
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
    props: {
      port: {
        type: String,
        default: defaultId,
      },
      props: {
        type: Object,
        default: () => {},
      },
      attrs: {
        type: Object,
        default: () => {},
      },
    },
    setup(props, ctx) {
      const context = $computed(() => getContext(props.port))

      context.attrs.value = props.attrs
      context.props.value = props.props
      const el = ref<HTMLElement>()

      onMounted(() => {
        context.el.value = el.value
        context.updateRect(el.value)
        context.land()
      })

      onBeforeUnmount(() => {
        context.updateRect(el.value)
        context.liftOff()
        // TODO: fixme
        // proxyEl.value = undefined
      })

      return () => h('div', {
        ref: el,
        class: 'starport-proxy',
      }, [
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
