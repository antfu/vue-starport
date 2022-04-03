<script setup lang="ts">
import { isDark, toggleDark } from '~/composables'
</script>

<template>
  <nav text-xl pt-6 gap-2 flex justify-center items-center>
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
