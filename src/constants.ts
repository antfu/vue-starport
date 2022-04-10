import type { InjectionKey } from 'vue'
import type { StarportOptions } from './types'
import type { InternalState } from './state'

export const InjectionState = 'vue-starport-injection' as unknown as InjectionKey<InternalState>
export const InjectionOptions = 'vue-starport-options' as unknown as InjectionKey<StarportOptions>
