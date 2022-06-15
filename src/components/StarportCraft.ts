import type { DefineComponent, StyleValue } from 'vue'
import { Teleport, computed, defineComponent, h, inject, mergeProps } from 'vue'
import { InjectionState } from '../constants'
import type { StarportCraftProps } from '../types'

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
    if (!state)
      throw new Error('[Vue Starport] Failed to find the carrier, all Starport components must be wrapped in a <StarportCarrier> component.')

    const sp = computed(() => state.getInstance(props.port, props.component))
    const id = computed(() => sp.value.el?.id || sp.value.id)

    const style = computed((): StyleValue => {
      const elapsed = Date.now() - sp.value.liftOffTime
      const duration = Math.max(0, sp.value.options.duration - elapsed)
      const rect = sp.value.rect

      const style: StyleValue = {
        position: 'absolute',
        left: 0,
        top: 0,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: rect.margin,
        padding: rect.padding,
        transform: `translate3d(${rect.left}px,${rect.top}px,0px)`,
      }
      if (!sp.value.isVisible || !sp.value.el) {
        return {
          ...style,
          zIndex: -1,
          display: 'none',
        }
      }
      if (sp.value.isLanded) {
        style.display = 'none'
      }
      else {
        Object.assign(style, {
          transitionProperty: 'all',
          transitionDuration: `${duration}ms`,
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
