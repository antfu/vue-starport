<script setup lang="ts">
import { metadata, proxyEl } from '~/composables/floating'

const attrs = useAttrs()
const el = ref<HTMLElement>()

metadata.attrs = attrs

onMounted(() => {
  proxyEl.value = el.value
})
</script>

<template>
  <div ref="el">
    <slot />
  </div>
</template>
