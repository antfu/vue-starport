<script setup lang="ts">
import { Starport } from 'vue-starport'
const a = ref(false)
const toggle = useToggle(a)
</script>

<template>
  <div>
    <div flex="~ gap2" justify-center>
      <RouterLink btn to="/" saturate-0 class="back-btn">
        Back
      </RouterLink>
      <button btn @click="toggle()">
        Toggle
      </button>
    </div>
    <Starport v-if="a" port="0" w-20 h-20>
      <MyComponent :index="0" />
    </Starport>
    <Starport v-else port="0" w-50 h-50 m10>
      <MyComponent :index="0" class="rounded-1/2" />
    </Starport>
  </div>
</template>
