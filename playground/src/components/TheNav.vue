<script setup lang="ts">
import { isDark, toggleDark } from '~/composables'
const route = useRoute()
</script>

<template>
  <nav
    px8 py4 mb-4
    border="b gray-400/10"
    flex="~ gap4"
    text-xl items-center
  >
    <div font-mono text-left leading-1em mr6 text-sm>
      Vue<br>Starport
    </div>
    <div text-lg font-mono>
      {{ route.path }}
    </div>
    <div flex-auto />
    <button class="icon-btn !outline-none" @click="toggleDark()">
      <div v-if="isDark" i-carbon-moon />
      <div v-else i-carbon-sun />
    </button>
    <a
      class="icon-btn"
      i-carbon-logo-github
      rel="noreferrer"
      href="https://github.com/antfu-sponsors/vue-starport"
      target="_blank"
      title="GitHub"
    />
  </nav>
</template>
