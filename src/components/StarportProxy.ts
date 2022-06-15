import type { DefineComponent } from 'vue'
import { computed, defineComponent, h, inject, mergeProps, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { InjectionState } from '../constants'
import { proxyProps } from '../options'
import type { StarportProxyProps } from '../types'

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
    if (!sp.value.isVisible) {
      sp.value.land()
      isMounted.value = true
    }

    onMounted(async () => {
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
          console.warn(`[Vue Starport] The proxy of component "${sp.value.componentName}" (port "${props.port}") has no ${attr} on initial render, have you set the size for it?`)
          console.warn('element:', sp.value.el)
          console.warn('rect:', sp.value.rect)
        }
      }
    })
    onBeforeUnmount(async () => {
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
      async () => {
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
