<script setup lang="ts">
import { images } from '../composables/data'
import { StarportProxy } from '../../../src'

const mode = ref(false)
const toggle = useToggle(mode)
</script>

<template>
  <div px6 py-2>
    <div p2 flex="~ gap-2" justify-center>
      <button btn @click="toggle()">
        Toggle Size
      </button>
    </div>
    <p pb-10>
      Shared component across routes with animations
    </p>
    <div flex="~ gap-4 wrap" justify-center>
      <RouterLink
        v-for="img, idx of images"
        :key="img"
        :to="`/${idx}`"
      >
        <StarportProxy
          transition-all duration-800
          :port="String(idx)"
          :class="mode ? 'w-50 h-50' : 'w-60 h-30'"
        >
          <TheImage
            class="rounded-xl"
            :src="img"
          />
        </StarportProxy>
      </RouterLink>
    </div>
  </div>
</template>
