export const isDark = useDark()
export const isDebug = ref(false)
export const toggleDark = useToggle(isDark)
export const toggleDebug = useToggle(isDebug)
