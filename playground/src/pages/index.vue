<script setup lang="ts">
import { TheImageProxy } from '../composables/image'

const mode = ref(false)
const toggle = useToggle(mode)
</script>

<template>
  <div px6 py-2>
    <div p2 flex="~ gap-2" justify-center>
      <button btn @click="toggle()">
        Toggle Size
      </button>
      <router-link btn to="/foo" saturate-0>
        Navigate
      </router-link>
    </div>
    <p pb-10>
      Shared component across routes with animations
    </p>
    <TheImageProxy
      transition-all duration-800
      :class="mode ? 'w-50 h-50' : 'w-60 h-30'"
      :attrs="{class: 'rounded-xl'}"
    />
  </div>
</template>
