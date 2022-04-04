import type { Component, StyleValue } from 'vue'
import { Teleport, computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, renderList, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { StarportContext } from './context'
import { createStarportContext } from './context'
import type { ResolvedStarportOptions, StarportInstance, StarportOptions } from './types'
import { nanoid } from './utils'

export function createStarport<T extends Component>(
  component: T,
  options: StarportOptions = {},
): StarportInstance {
  const resolved: ResolvedStarportOptions = {
    duration: 650,
    ...options,
  }

  const defaultPort = nanoid()
  const counter = ref(0)
  const portMap = new Map<string, StarportContext>()

  function getContext(port = defaultPort) {
    if (!portMap.has(port)) {
      counter.value += 1
      portMap.set(port, createStarportContext())
    }
    return portMap.get(port)!
  }

  const starcraft = defineComponent({
    name: 'StarportCraft',
    props: {
      port: {
        type: String,
        default: defaultPort,
      },
    },
    setup(props) {
      const router = useRouter()
      const context = computed(() => getContext(props.port))
      const id = computed(() => context.value.el?.id || context.value.id)

      const style = computed((): StyleValue => {
        const rect = context.value.rect
        const style: StyleValue = {
          position: 'fixed',
          left: `${rect.x ?? 0}px`,
          top: `${rect.y ?? 0}px`,
          width: `${rect.width ?? 0}px`,
          height: `${rect.height ?? 0}px`,
        }
        if (!context.value.isVisible || !context.value.el) {
          return {
            ...style,
            opacity: 0,
            zIndex: -1,
            pointerEvents: 'none',
            transition: 'all 400ms ease-in-out',
          }
        }
        if (context.value.isLanded)
          style.pointerEvents = 'none'
        else
          style.transition = `all ${resolved.duration}ms ease-in-out`
        return style
      })

      const cleanRouterGuard = router.beforeEach(async() => {
        context.value.liftOff()
        await nextTick()
      })
      onBeforeUnmount(cleanRouterGuard)

      return () => {
        const teleport = context.value.isLanded && context.value.el && context.value.isMounted
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
          h(
            Teleport,
            {
              to: teleport
                ? `#${id.value}`
                : 'body',
              disabled: !teleport,
            },
            h(component as any, context.value.props),
          ),
        )
      }
    },
  })

  const proxy = defineComponent({
    name: 'StarportProxy',
    props: {
      port: {
        type: String,
        default: defaultPort,
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
      const el = context.value.elRef()
      const id = nanoid()

      if (!context.value.isVisible)
        context.value.land()

      onBeforeUnmount(() => {
        context.value.rect.update()
        context.value.liftOff()
      })

      onMounted(async() => {
        await nextTick()
        context.value.rect.update()
        context.value.isMounted = true
      })

      watch(
        () => props.props,
        () => context.value.props = props.props,
        { deep: true, immediate: true },
      )

      return () => h(
        'div',
        {
          ref: el,
          id,
          style: `transition: all ${resolved.duration}ms ease`,
          class: 'starport-proxy',
        },
        ctx.slots.default
          ? h(ctx.slots.default)
          : undefined,
      )
    },
  })

  const carrier = defineComponent({
    name: 'StarportSubCarrier',
    render() {
      // Workaround: force renderer
      // eslint-disable-next-line no-unused-expressions
      counter.value
      return renderList(
        Array.from(portMap.keys()),
        port => h(starcraft, {
          port,
          key: port,
        }),
      )
    },
  })

  return {
    carrier,
    starcraft,
    proxy,
    options,
  }
}
