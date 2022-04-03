<script setup lang="ts">
import { isDark, toggleDark } from '~/composables'
const route = useRoute()
</script>

<template>
  <div p4 border="b gray-400/10" mb-4 flex="~" items-center>
    <div font-mono text-left leading-1em mr6>
      Vue<br>Starport
    </div>
    <div text-lg font-mono>
      {{ route.path }}
    </div>
    <div flex-auto />
  </div>
</template>
