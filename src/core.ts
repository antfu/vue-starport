import type { DefineComponent, StyleValue } from 'vue'
import { Teleport, computed, defineComponent, h, inject, mergeProps, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { InjectionState } from './constants'
import { proxyProps } from './options'
import type { StarportCraftProps, StarportProxyProps } from './types'

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
    const sp = computed(() => state.getInstance(props.port, props.component))
    const id = computed(() => sp.value.el?.id || sp.value.id)

    const style = computed((): StyleValue => {
      const rect = sp.value.rect
      const style: StyleValue = {
        position: 'fixed',
        left: 0,
        top: 0,
        width: `${rect.width ?? 0}px`,
        height: `${rect.height ?? 0}px`,
        transform: `translate3d(${rect.x ?? 0}px, ${rect.y ?? 0}px,0px)`,
      }
      if (!sp.value.isVisible || !sp.value.el) {
        return {
          ...style,
          opacity: 0,
          zIndex: -1,
          pointerEvents: 'none',
          transitionProperty: 'all',
          // TODO: make this configurable
          transitionDuration: `${sp.value.options.duration / 3}ms`,
          transitionTimingFunction: sp.value.options.easing,
        }
      }
      if (sp.value.isLanded) {
        style.pointerEvents = 'none'
        style.display = 'none'
      }
      else {
        Object.assign(style, {
          transitionProperty: 'all',
          transitionDuration: `${sp.value.options.duration}ms`,
          transitionTimingFunction: sp.value.options.easing,
        })
      }
      return style
    })

    const additionalProps = process.env.NODE_ENV === 'production'
      ? {}
      : {
        onTransitionend(e: TransitionEvent) {
          if (sp.value.isLanded)
            return
          console.warn(`[Vue Starport] Transition duration of component "${sp.value.componentName}" is too short (${e.elapsedTime}s) that may cause animation glitches. Try to increase the duration of that component, or decrease the duration the Starport (current: ${sp.value.options.duration / 1000}s).`)
        },
      }

    return () => {
      const teleport = !!(sp.value.isLanded && sp.value.el)
      return h(
        'div',
        {
          'style': style.value,
          'data-starport-craft': sp.value.componentId,
          'data-starport-landed': sp.value.isLanded ? 'true' : undefined,
          'data-starport-floating': !sp.value.isLanded ? 'true' : undefined,
          'onTransitionend': sp.value.land,
        },
        h(
          Teleport,
          {
            to: teleport ? `#${id.value}` : 'body',
            disabled: !teleport,
          },
          h(sp.value.component as any,
            mergeProps(additionalProps, sp.value.props),
          ),
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
    props: {
      type: Object,
      default: () => ({}),
    },
    component: {
      type: Object,
      required: true,
    },
    ...proxyProps,
  },
  setup(props, ctx) {
    const state = inject(InjectionState)!
    const sp = computed(() => state.getInstance(props.port, props.component))
    const el = ref<HTMLElement>()
    const id = sp.value.generateId()
    const isMounted = ref(false)

    // first time appearing, directly landed
    if (!sp.value.isVisible)
      sp.value.land()

    onMounted(async() => {
      if (sp.value.el) {
        if (process.env.NODE_ENV === 'development')
          console.error(`[Vue Starport] Multiple proxies of "${sp.value.componentName}" with port "${props.port}" detected. The later one will be ignored.`)
        return
      }
      sp.value.el = el.value
      await nextTick()
      isMounted.value = true
      sp.value.rect.update()
      // warn if no width or height
      if (process.env.NODE_ENV === 'development') {
        if (sp.value.rect.width === 0 || sp.value.rect.height === 0) {
          const attr = sp.value.rect.width === 0 ? 'width' : 'height'
          console.warn(`[Vue Starport] The proxy of component "${sp.value.componentName}" has no ${attr} on initial render, have you set the size for it?`)
        }
      }
    })
    onBeforeUnmount(async() => {
      sp.value.rect.update()
      sp.value.liftOff()
      sp.value.el = undefined
      isMounted.value = false

      if (sp.value.options.keepAlive)
        return

      await nextTick()
      await nextTick()
      if (sp.value.el)
        return

      // dispose
      state.dispose(sp.value.port)
    })

    watch(
      () => props,
      async() => {
        // wait a tick for teleport to lift off then update the props
        if (sp.value.props)
          await nextTick()
        const { props: childProps, ...options } = props
        sp.value.props = childProps || {}
        sp.value.setLocalOptions(options)
      },
      { deep: true, immediate: true },
    )

    return () => {
      const { initialProps, mountedProps, ..._attrs } = props
      const attrs = mergeProps(
        _attrs as any,
        (isMounted.value ? mountedProps : initialProps) || {},
      )

      return h(
        'div',
        mergeProps(attrs, {
          id,
          'ref': el,
          'data-starport-proxy': sp.value.componentId,
          'data-starport-landed': sp.value.isLanded ? 'true' : undefined,
          'data-starport-floating': !sp.value.isLanded ? 'true' : undefined,
        }),
        ctx.slots.default
          ? h(ctx.slots.default)
          : undefined,
      )
    }
  },
}) as DefineComponent<StarportProxyProps>
