<script setup lang="ts">
import { TheImageProxy } from '../composables/image'

let size = $(useStorage('size', 200))

function enlarge() {
  size += 20
}

function reset() {
  size = 200
}
</script>

<template>
  <div px6 py-2 flex="~ col" items-center>
    <div p2 flex="~ gap-2">
      <router-link btn to="/" saturate-0>
        Back
      </router-link>
      <button btn @click="enlarge()">
        Enlarge
      </button>
      <button btn @click="reset()">
        Reset
      </button>
    </div>
    <div m10 flex="~ col sm:row-reverse gap-4" items-center max-w-180>
      <TheImageProxy
        transition-all duration-600
        :style="{ width: size + 'px', height: size + 'px' }"
        :attrs="{ class: 'rounded-1/2 shadow-xl' }"
      />
      <p flex-1 text-left>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </div>
  </div>
</template>
