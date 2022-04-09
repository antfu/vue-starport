<script setup lang="ts">
import { Starport } from 'vue-starport'
</script>

<template>
  <div>
    <Starport w-20 h-20 port="0">
      <MyComponent :index="0" />
    </Starport>
    <Starport w-20 h-20 port="0">
      <MyComponent :index="0" />
    </Starport>
  </div>
</template>
