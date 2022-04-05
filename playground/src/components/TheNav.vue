<script setup lang="ts">
import { isDark, toggleDark } from '~/composables'
</script>

<template>
  <nav
    px8 py4 mb-4
    border="b gray-400/10"
    flex="~ gap2"
    text-xl items-center
  >
    <img src="/favicon.svg" h-10>
    <div font-mono text-left leading-1em mr6 text-sm>
      Vue<br>Starport
    </div>
    <div flex-auto />

    <div flex="~ gap4" items-center>
      <p bg-rose p="x4 t1 b0.8" hidden sm:block rounded text-white text-sm shadow>
        Source code is available to
        <a href="https://github.com/sponsors/antfu" underline target="_blank">Sponsors</a>
        as early access
      </p>
      <a
        class="icon-btn"
        i-carbon-logo-github
        rel="noreferrer"
        href="https://github.com/antfu-sponsors/vue-starport"
        target="_blank"
        title="GitHub"
      />
      <button class="icon-btn !outline-none" @click="toggleDark()">
        <div v-if="isDark" i-carbon-moon />
        <div v-else i-carbon-sun />
      </button>
    </div>
  </nav>
</template>
