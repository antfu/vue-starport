import type { ResolvedStarportOptions } from './types'

export const defaultOptions: ResolvedStarportOptions = {
  duration: 800,
  easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
  keepAlive: true,
}

export function defaultStyle(context: any): {} {
  const duration = context.options.duration
  const transitionTimingFunction = context.options.easing
  const isVisible = context.isVisible && context.el
  const transitionDuration = `${isVisible ? duration : duration / 3}ms`

  const visibleStyle = {
    opacity: 0,
    zIndex: -1,
    pointerEvents: 'none',
  }
  const commonStyle = {
    transitionProperty: 'all',
    transitionDuration,
    transitionTimingFunction,
  }
  return isVisible ? commonStyle : Object.assign(commonStyle, visibleStyle)
}

export const optionsProps = {
  duration: {
    type: Number,
    require: false,
  },
  easing: {
    type: String,
    require: false,
  },
  keepAlive: {
    type: Boolean,
    require: false,
  },
}
