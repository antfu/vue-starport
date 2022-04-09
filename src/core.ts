import type { Component, StyleValue } from 'vue'
import { Teleport, computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import type { StarportContext } from './context'
import { createStarportContext } from './context'
import { optionsProps } from './options'
import type { StarportComponents, StarportOptions } from './types'
import { kebabCase, nanoid } from './utils'

/**
 * Create Starport HOCs from a component
 *
 * @advanced
 */
export function createStarport<T extends Component>(
  component: T,
  options: StarportOptions = {},
): StarportComponents {
  // @ts-expect-error untyped attr
  const componentName = component.name || component.__file?.split(/[\/\\.]/).slice(-2)[0] || ''
  const componentId = kebabCase(componentName) || nanoid()
  const defaultPort = 'default'
  const counter = ref(0)
  const portMap = new Map<string, StarportContext>()

  function getContext(port = defaultPort) {
    if (!portMap.has(port)) {
      counter.value += 1
      portMap.set(port, createStarportContext(componentId, port))
    }
    return portMap.get(port)!
  }

  const starcraft = defineComponent({
    name: `starport-craft-${componentId}`,
    props: {
      port: {
        type: String,
        default: defaultPort,
      },
    },
    setup(props) {
      const context = getContext(props.port)
      const id = computed(() => context.el?.id || context.id)

      const style = computed((): StyleValue => {
        const rect = context.rect
        const style: StyleValue = {
          position: 'fixed',
          left: 0,
          top: 0,
          width: `${rect.width ?? 0}px`,
          height: `${rect.height ?? 0}px`,
          transform: `translate3d(${rect.x ?? 0}px, ${rect.y ?? 0}px,0px)`,
        }
        if (!context.isVisible || !context.el) {
          return {
            ...style,
            opacity: 0,
            zIndex: -1,
            pointerEvents: 'none',
            transitionProperty: 'all',
            // TODO: make this configurable
            transitionDuration: `${context.options.duration / 3}ms`,
            transitionTimingFunction: context.options.easing,
          }
        }
        if (context.isLanded) {
          style.pointerEvents = 'none'
        }
        else {
          Object.assign(style, {
            transitionProperty: 'all',
            transitionDuration: `${context.options.duration}ms`,
            transitionTimingFunction: context.options.easing,
          })
        }
        return style
      })

      return () => {
        const teleport = context.isLanded && context.el
        return h(
          'div',
          {
            style: style.value,
            class: `starport-craft-${componentId}`,
            onTransitionend: context.land,
          },
          h(
            Teleport,
            {
              to: teleport ? `#${id.value}` : 'body',
              disabled: !teleport,
            },
            h(component as any, context.props),
          ),
        )
      }
    },
  })

  const proxy = defineComponent({
    name: `starport-proxy-${componentId}`,
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
      const context = getContext(props.port)
      const el = ref<HTMLElement>()
      const id = context.generateId()

      if (!context.isVisible)
        context.land()

      onMounted(async () => {
        if (context.el) {
          if (process.env.NODE_ENV === 'development')
            console.error(`[Vue Starport] Multiple proxies of "${componentName}" with port "${props.port}" detected. The later one will be ignored.`)
          return
        }
        context.el = el.value
        // warn if no width or height
        if (process.env.NODE_ENV === 'development') {
          if (context.rect.width === 0 || context.rect.height === 0) {
            const attr = context.rect.width === 0 ? 'width' : 'height'
            console.warn(`[Vue Starport] The proxy of component "${componentName}" has no ${attr} on initial render, have you set the size for it?`)
          }
        }
      })

      onBeforeRouteLeave(() => {
        context.liftOff()
      })

      onBeforeUnmount(() => {
        // context.liftOff()
        context.el = undefined
      })

      watch(
        () => props,
        () => {
          const { props: childProps, ...options } = props
          context.props = childProps
          context.setLocalOptions(options)
        },
        { deep: true, immediate: true },
      )

      return () => h(
        'div',
        {
          ref: el,
          id,
          style: {
            transitionProperty: 'all',
            transitionDuration: `${context.options.duration}ms`,
            transitionTimingFunction: context.options.easing,
          },
          class: `starport-proxy-${componentId}`,
        },
        ctx.slots.default
          ? h(ctx.slots.default)
          : undefined,
      )
    },
  })

  const board = defineComponent({
    name: `starport-board-${componentId}`,
    render() {
      // Workaround: force renderer
      // eslint-disable-next-line no-unused-expressions
      counter.value
      return Array.from(portMap.keys())
        .map(port => h(starcraft, { port, key: port }))
    },
  })

  return {
    board,
    starcraft,
    proxy,
    options,
  }
}
