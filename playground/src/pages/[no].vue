<script setup lang="ts">
import { Starport } from 'vue-starport'
import { images } from '~/composables/data'

const props = defineProps<{
  no: string
}>()

const index = $computed(() => +props.no)
const next = $computed(() => (index + 1) % images.length)
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
      <!-- <router-link btn :to="`/${next}`" saturate-0>
        Next
      </router-link> -->
    </div>
    <div m10 flex="~ col sm:row gap6" items-center max-w-180>
      <Starport
        transition-all duration-600
        :port="String(index)"
        :style="{ width: size + 'px', height: size + 'px' }"
      >
        <TheImage
          class="rounded-1/2 shadow-xl"
          :src="images[index]"
        />
      </Starport>

      <p flex-1 text-left>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </div>

    <div m10 flex="~ col-reverse sm:row gap6" items-center max-w-180>
      <p flex-1 text-left>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <Starport
        transition-all duration-600
        :port="String(next)"
        :style="{ width: size + 'px', height: size + 'px' }"
      >
        <TheImage
          class="rounded-1/2 shadow-xl"
          :src="images[next]"
        />
      </Starport>
      <div />
    </div>
  </div>
</template>
