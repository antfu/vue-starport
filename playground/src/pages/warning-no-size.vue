<script setup lang="ts">
import { Starport } from 'vue-starport'
</script>

<template>
  <Starport port="0">
    <MyComponent :index="0" />
  </Starport>
</template>
