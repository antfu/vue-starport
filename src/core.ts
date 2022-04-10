import type { DefineComponent, StyleValue } from 'vue'
import { Teleport, computed, defineComponent, h, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { InjectionState } from './constants'
import { optionsProps } from './options'
import type { StarportCraftProps, StarportProps } from './types'

/**
 * @internal
 */
export const StarportCraft = defineComponent({
  name: 'StarportCraft',
  props: {
    port: {
      type: String,
      required: true,
    },
    component: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const state = inject(InjectionState)!
    const context = state.getContext(props.port, props.component)
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
      const teleport = !!(context.isLanded && context.el)
      return h(
        'div',
        {
          style: style.value,
          class: `starport-craft-${context.componentId}`,
          onTransitionend: context.land,
        },
        h(
          Teleport,
          {
            to: teleport ? `#${id.value}` : 'body',
            disabled: !teleport,
          },
          h(context.component as any, context.props),
        ),
      )
    }
  },
}) as DefineComponent<StarportCraftProps>

/**
 * @internal
 */
export const StarportProxy = defineComponent({
  name: 'StarportProxy',
  props: {
    port: {
      type: String,
      required: true,
    },
    props: {
      type: Object,
      default: () => { },
    },
    component: {
      type: Object,
      required: true,
    },
    ...optionsProps,
  },
  setup(props, ctx) {
    const state = inject(InjectionState)!
    const context = state.getContext(props.port, props.component)
    const el = ref<HTMLElement>()
    const id = context.generateId()

    if (!context.isVisible)
      context.land()

    onMounted(async() => {
      if (context.el) {
        if (process.env.NODE_ENV === 'development')
          console.error(`[Vue Starport] Multiple proxies of "${context.componentName}" with port "${props.port}" detected. The later one will be ignored.`)
        return
      }
      context.el = el.value
      await nextTick()
      context.rect.update()
      // warn if no width or height
      if (process.env.NODE_ENV === 'development') {
        if (context.rect.width === 0 || context.rect.height === 0) {
          const attr = context.rect.width === 0 ? 'width' : 'height'
          console.warn(`[Vue Starport] The proxy of component "${context.componentName}" has no ${attr} on initial render, have you set the size for it?`)
        }
      }
    })

    onBeforeUnmount(() => {
      context.liftOff()
      context.el = undefined

      if (!context.options.keepAlive) {
        setTimeout(() => {
          if (context.el)
            return
          context.scope.stop()
          state.portMap.delete(context.port)
        }, 100)
      }
    })

    watch(
      () => props,
      async() => {
        // wait a tick for teleport to lift off then update the props
        if (context.props)
          await nextTick()
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
        class: `starport-proxy-${context.componentId}`,
      },
      ctx.slots.default
        ? h(ctx.slots.default)
        : undefined,
    )
  },
}) as DefineComponent<StarportProps>
