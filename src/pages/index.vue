<script setup lang="ts">
import { TheImageProxy } from '../composables/image'

const mode = ref(false)
const toggle = useToggle(mode)
</script>

<template>
  <div px8 py-2>
    <p>Shared component across routes with animations</p>
    <div p4>
      <button btn @click="toggle()">
        Toggle Size
      </button>
    </div>
    <TheImageProxy
      :class="mode ? 'w-50 h-50' : 'w-60 h-30'"
      :attrs="{class: 'rounded-xl'}"
    />
  </div>
</template>
