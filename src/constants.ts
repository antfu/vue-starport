import type { InjectionKey } from 'vue'
import type { StarportOptions } from './types'
import type { createInternalState } from './state'

export const InjectionState: InjectionKey<ReturnType<typeof createInternalState>> = Symbol('vue-starport-injection')
export const InjectionOptions: InjectionKey<StarportOptions> = Symbol('vue-starport-options')
