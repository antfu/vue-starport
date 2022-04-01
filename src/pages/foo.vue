<script setup lang="ts">
import { TheImageProxy } from '../composables/image'

let size = $(useStorage('size', 100))

function enlarge() {
  size += 20
}

function reset() {
  size = 100
}
</script>

<template>
  <div flex="~ col" items-center>
    <div>Foo</div>
    <div>
      <RouterLink
        class="m-3 text-sm btn"
        to="/"
      >
        Back
      </RouterLink>
      <button btn @click="enlarge()">
        Enlarge
      </button>
      <button btn @click="reset()">
        Reset
      </button>
    </div>
    <div m10 flex="~ col sm:row gap-4" items-center>
      <TheImageProxy :style="{ width: size + 'px', height: size + 'px' }" rounded="1/2" />
      <p flex-1>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </div>
  </div>
</template>
