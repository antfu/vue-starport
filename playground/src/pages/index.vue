<script setup lang="ts">
import { Starport } from 'vue-starport'
import { images } from '~/composables/data'

const mode = useStorage('starport-image-mode', true)
const toggle = useToggle(mode)
</script>

<template>
  <div px6 py-2>
    <TheLogo w40 h40 ma />
    <p pb-5>
      Shared component across routes with animations
    </p>
    <div p5 flex="~ gap-2" justify-center>
      <button btn @click="toggle()">
        Toggle Size
      </button>
    </div>
    <div grid="~ cols-1 md:cols-3 lg:cols-4 xl:cols-6" px-10 justify-center>
      <RouterLink
        v-for="img, idx of images"
        :key="img"
        :to="`/${idx}`"
      >
        <Starport
          transition-all duration-600
          :port="String(idx)"
          :class="mode ? 'aspect-1/1 m2' : 'aspect-16/9'"
        >
          <TheImage
            :class="mode ? 'rounded shadow-lg' : ''"
            :src="img"
          />
        </Starport>
      </RouterLink>
    </div>
  </div>
</template>
