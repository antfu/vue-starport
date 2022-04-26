import type { InjectionKey } from 'vue'
import type { StarportOptions } from './types'
import type { GlobalState, InternalState } from './state'

export const InjectionState = 'vue-starport-injection' as unknown as InjectionKey<InternalState>
export const InjectionOptions = 'vue-starport-options' as unknown as InjectionKey<StarportOptions>
export const InjectionGlobalState = 'vue-starport-global-state' as unknown as InjectionKey<GlobalState>
