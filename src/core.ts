import type { Component, StyleValue } from 'vue'
import { Teleport, computed, defineComponent, h, onBeforeUnmount, onMounted, ref, renderList, nextTick } from 'vue'
import type { StarportContext } from './context'
import { createStarportContext } from './context'
import { optionsProps } from './options'
import type { StarportInstance, StarportOptions } from './types'
import { nanoid } from './utils'

export function createStarport<T extends Component>(
  component: T,
  options: StarportOptions = {},
): StarportInstance {
  const defaultPort = nanoid()
  const counter = ref(0)
  const portMap = new Map<string, StarportContext>()

  function getContext(port = defaultPort) {
    if (!portMap.has(port)) {
      counter.value += 1
      portMap.set(port, createStarportContext(port))
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
        if (!context.value.el) {
          return {
            ...style,
            opacity: 0,
            zIndex: -1,
            pointerEvents: 'none',
            transition: 'all 400ms ease-in-out',
          }
        }
        if (context.value.isLanded) {
          style.pointerEvents = 'none'
        }
        else {
          Object.assign(style, {
            transitionProperty: 'all',
            transitionDuration: `${context.value.options.duration}ms`,
            transitionTimingFunction: context.value.options.easing,
          })
        }
        function match() {
          return /\/[0-9]/.test(location.pathname)
        }
        if (match()) {
          style.pointerEvents = ''
        }
        return style
      })

      const disabled = ref(!(context.value.isLanded && context.value.el))

      return () => {
        const teleport = context.value.isLanded && context.value.el
        return h(
          'div',
          {
            style: style.value,
            class: 'starport-container',
            ontransitionend: async () => {
              disabled.value = false
              context.value.land()
            }
          },
          h(
            Teleport,
            {
              to: teleport
                ? `#${id.value}`
                : 'body',
              disabled,
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
        default: () => { },
      },
      ...optionsProps,
    },
    setup(props, ctx) {
      const context = computed(() => getContext(props.port))
      const el = ref<HTMLElement>()
      const id = nanoid()
      onBeforeUnmount(() => {
        context.value.liftOff()
        context.value.el = undefined
      })
      onMounted(async () => {
        await nextTick()
        context.value.el = el.value
      })

      watchEffect(() => {
        const { props: childProps, ...options } = props
        context.value.props = childProps
        context.value.setLocalOptions(options)
      })

      return () => h(
        'div',
        {
          ref: el,
          id,
          style: {
            transitionProperty: 'all',
            transitionDuration: `${context.value.options.duration}ms`,
            transitionTimingFunction: context.value.options.easing,
          },
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
