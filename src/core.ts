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
    const sp = $computed(() => state.getInstance(props.port, props.component))
    const id = computed(() => sp.el?.id || sp.id)

    const style = computed((): StyleValue => {
      const rect = sp.rect
      const style: StyleValue = {
        position: 'fixed',
        left: 0,
        top: 0,
        width: `${rect.width ?? 0}px`,
        height: `${rect.height ?? 0}px`,
        transform: `translate3d(${rect.x ?? 0}px, ${rect.y ?? 0}px,0px)`,
      }
      if (!sp.isVisible || !sp.el) {
        return {
          ...style,
          opacity: 0,
          zIndex: -1,
          pointerEvents: 'none',
          transitionProperty: 'all',
          // TODO: make this configurable
          transitionDuration: `${sp.options.duration / 3}ms`,
          transitionTimingFunction: sp.options.easing,
        }
      }
      if (sp.isLanded) {
        style.pointerEvents = 'none'
        style.display = 'none'
      }
      else {
        Object.assign(style, {
          transitionProperty: 'all',
          transitionDuration: `${sp.options.duration}ms`,
          transitionTimingFunction: sp.options.easing,
        })
      }
      return style
    })

    return () => {
      const teleport = !!(sp.isLanded && sp.el)
      return h(
        'div',
        {
          'style': style.value,
          'data-starport-craft': sp.componentId,
          'data-starport-landed': sp.isLanded ? 'true' : undefined,
          'data-starport-floating': !sp.isLanded ? 'true' : undefined,
          'onTransitionend': () => sp.land,
        },
        h(
          Teleport,
          {
            to: teleport ? `#${id.value}` : 'body',
            disabled: !teleport,
          },
          h(sp.component as any, sp.props),
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
    const sp = state.getInstance(props.port, props.component)
    const el = ref<HTMLElement>()
    const id = sp.generateId()

    // first time appearing, directly landed
    if (!sp.isVisible)
      sp.land()

    onMounted(async() => {
      if (sp.el) {
        if (process.env.NODE_ENV === 'development')
          console.error(`[Vue Starport] Multiple proxies of "${sp.componentName}" with port "${props.port}" detected. The later one will be ignored.`)
        return
      }
      sp.el = el.value
      await nextTick()
      sp.rect.update()

      // warn if no width or height
      if (process.env.NODE_ENV === 'development') {
        if (sp.rect.width === 0 || sp.rect.height === 0) {
          const attr = sp.rect.width === 0 ? 'width' : 'height'
          console.warn(`[Vue Starport] The proxy of component "${sp.componentName}" has no ${attr} on initial render, have you set the size for it?`)
        }
      }
    })

    onBeforeUnmount(async() => {
      sp.liftOff()
      sp.el = undefined
      if (sp.options.keepAlive)
        return

      await nextTick()
      await nextTick()
      if (sp.el)
        return

      // dispose
      state.dispose(sp.port)
    })

    watch(
      () => props,
      async() => {
        // wait a tick for teleport to lift off then update the props
        if (sp.props)
          await nextTick()
        const { props: childProps, ...options } = props
        sp.props = childProps
        sp.setLocalOptions(options)
      },
      { deep: true, immediate: true },
    )

    return () => h(
      'div',
      {
        id,
        'ref': el,
        'style': {
          transitionProperty: 'all',
          transitionDuration: `${sp.options.duration}ms`,
          transitionTimingFunction: sp.options.easing,
        },
        'data-starport-proxy': sp.componentId,
        'data-starport-landed': sp.isLanded ? 'true' : undefined,
        'data-starport-floating': !sp.isLanded ? 'true' : undefined,
      },
      ctx.slots.default
        ? h(ctx.slots.default)
        : undefined,
    )
  },
}) as DefineComponent<StarportProps>
