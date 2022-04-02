import { nanoid } from 'nanoid'
import type { Component, StyleValue } from 'vue'
import { Teleport, computed, defineComponent, h, onBeforeUnmount } from 'vue'
import { StarportContext } from './context'
import type { ResolvedStarportOptions, StarportOptions } from './types'

export function createStarport<T extends Component>(
  component: T,
  options: StarportOptions = {},
) {
  const resolved: ResolvedStarportOptions = {
    duration: 800,
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
      const router = useRouter()
      const context = computed(() => getContext(props.port))

      const style = computed((): StyleValue => {
        const fixed: StyleValue = {
          transition: `all ${resolved.duration}ms ease-in-out`,
          position: 'fixed',
        }
        const rect = context.value.rect
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

      const cleanRouterGuard = router.beforeEach(async() => {
        context.value.liftOff()
        await nextTick()
      })

      onBeforeUnmount(() => {
        cleanRouterGuard()
      })

      return () => {
        const comp = h(component as any, {
          ...context.value.props.value,
          ...context.value.attrs.value,
        })
        return h(
          'div',
          {
            style: style.value,
            class: 'starport-container',
            onTransitionend: async() => {
              await nextTick()
              context.value.land()
            },
          },
          h(Teleport, {
            to: context.value.isLanded.value
              ? `#${context.value.id}`
              : 'body',
            disabled: !context.value.isLanded.value,
          },
          comp,
          ),
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

      onBeforeUnmount(() => {
        context.value.liftOff()
      })

      context.value.attrs.value = props.attrs
      context.value.props.value = props.props

      return () => h(
        'div',
        {
          ref: context.value.el,
          id: context.value.id,
          class: 'starport-proxy',
        },
        ctx.slots.default
          ? h(ctx.slots.default)
          : undefined,
      )
    },
  }) as any as T

  return {
    container,
    proxy,
  }
}
