<script setup lang="ts">
const counter = $ref(0)

onMounted(() => {
  console.log('Image Mounted')
})
</script>

<template>
  <div
    overflow-hidden
    transition-all duration-800
    relative select-none
    @click="counter += 1"
  >
    <img
      object-cover block w-full h-full
      src="https://source.unsplash.com/collection/94734566/512x512"
      bg-gray-400:20
    >
    <div absolute pt-5 left-0 right-0 bottom-0 bg-gradient-to-t from-black:40 to-transprent flex items-center justify-center>
      {{ counter }}
    </div>
  </div>
</template>
