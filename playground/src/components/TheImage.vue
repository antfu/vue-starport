<script setup lang="ts">
defineProps<{
  src: string
}>()

const counter = $ref(Math.round(Math.random() * 100))

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log('Image Mounted')
})
</script>

<template>
  <div
    overflow-hidden w-full h-full
    transition-all duration-800
    relative select-none
    @click="counter += 1"
  >
    <img
      object-cover block w-full h-full
      bg-gray-400:20
      :src="src"
    >
    <div
      absolute pt-5 left-0 right-0 bottom-0
      bg-gradient-to-t from-black:40 to-transparent
      text-white font-mono flex
      items-center justify-center
      @click.prevent="counter += 1"
    >
      {{ counter }}
    </div>
  </div>
</template>
