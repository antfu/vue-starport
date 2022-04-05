import type { ResolvedStarportOptions } from './types'

export const defaultOptions: ResolvedStarportOptions = {
  duration: 800,
  easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
  keepAlive: true,
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
