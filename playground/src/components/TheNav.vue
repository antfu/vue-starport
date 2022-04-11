<script setup lang="ts">
import { isDark, isDebug, toggleDark, toggleDebug } from '~/composables'
</script>

<template>
  <nav
    px8 py4 mb-4
    border="b gray-400/10"
    flex="~ gap2"
    text-xl items-center
  >
    <RouterLink to="/" flex="~ gap2" items-center>
      <img src="/favicon.svg" h-10>
      <div font-mono text-left leading-1em mr6 text-sm>
        Vue<br>Starport
      </div>
    </RouterLink>

    <div flex-auto />

    <div flex="~ gap4" items-center>
      <button
        class="icon-btn !outline-none p1"
        :class="isDebug ? '!text-red bg-red:10 rounded' : ''"
        @click="toggleDebug()"
      >
        <div i-carbon-debug />
      </button>
      <a
        class="icon-btn"
        i-carbon-logo-github
        rel="noreferrer"
        href="https://github.com/antfu/vue-starport"
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
