import type { ResolvedStarportOptions } from './types'

export const defaultOptions: ResolvedStarportOptions = {
  duration: 800,
  easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
  keepAlive: false,
}

export const proxyProps = {
  port: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: false,
  },
  easing: {
    type: String,
    required: false,
  },
  keepAlive: {
    type: Boolean,
    required: false,
    default: undefined,
  },
  mountedProps: {
    type: Object,
    required: false,
  },
  initialProps: {
    type: Object,
    required: false,
  },
} as const
