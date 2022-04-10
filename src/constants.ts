import type { InjectionKey } from 'vue'
import type { StarportOptions } from './types'
import type { createInternalState } from './state'

export const InjectionState = 'vue-starport-injection' as unknown as InjectionKey<ReturnType<typeof createInternalState>>
export const InjectionOptions = 'vue-starport-options' as unknown as InjectionKey<StarportOptions>
