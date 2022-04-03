<script setup lang="ts">
import { images } from '../composables/data'
import { Starport } from '../../../src'

const mode = useStorage('starport-image-mode', true)
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
    <div flex="~ gap-4 wrap" px-10>
      <RouterLink
        v-for="img, idx of images"
        :key="img"
        :to="`/${idx}`"
      >
        <Starport
          transition-all duration-800
          :port="String(idx)"
          :class="mode ? 'w-50 h-50' : 'w-70 h-30'"
        >
          <TheImage
            :class="mode ? 'rounded-xl' : 'rounded'"
            :src="img"
          />
        </Starport>
      </RouterLink>
    </div>
    <Starport>
      <Footer />
    </Starport>
  </div>
</template>
