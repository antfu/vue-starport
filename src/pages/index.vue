<script setup lang="ts">
import { TheImageProxy } from '../composables/image'

const mode = ref(false)
const toggle = useToggle(mode)
</script>

<template>
  <div p4>
    <div p4>
      <button btn @click="toggle()">
        Toggle
      </button>
    </div>
    <TheImageProxy :class="mode ? 'w-50 h-50' : 'w-60 h-30'" rounded-xl />
  </div>
</template>
