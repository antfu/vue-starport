import { nanoid } from 'nanoid'
import type { Component, StyleValue } from 'vue'
import { Teleport, computed, defineComponent, h, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { useEventListener, useMutationObserver } from '@vueuse/core'
import { StarportContext } from './context'
import type { ResolvedStarportOptions, StarportOptions } from './types'

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
      const context = computed(() => getContext(props.port))

      const style = computed((): StyleValue => {
        const fixed: StyleValue = {
          transition: `all ${resolved.duration}ms ease-in-out`,
          position: 'fixed',
        }
        const rect = context.value.rect.value
        if (!rect || !context.value.el.value) {
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

      useMutationObserver(context.value.el, () => context.value.updateRect(), {
        attributes: true,
      })
      useEventListener('resize', () => context.value.updateRect())
      watchEffect(() => context.value.updateRect())

      return () => {
        const comp = h(component as any, {
          ...context.value.props.value,
          ...context.value.attrs.value,
        })
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
                to: context.value.el.value,
                disabled: teleports,
              },
              [comp])
              : comp,
          ],
        )
      }
    },
  }) as any as T

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
      const context = computed(() => getContext(props.port))

      context.value.attrs.value = props.attrs
      context.value.props.value = props.props
      const el = ref<HTMLElement>()

      onMounted(() => {
        context.value.el.value = el.value
        context.value.updateRect(el.value)
        context.value.land()
      })

      onBeforeUnmount(() => {
        context.value.updateRect(el.value)
        context.value.liftOff()
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
  }) as any as T

  return {
    container,
    proxy,
  }
}
