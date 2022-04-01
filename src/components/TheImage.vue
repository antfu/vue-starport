<script setup lang="ts">
const a = $ref(false)
</script>

<template>
  <div overflow-hidden transition-all @click="a = !a">
    <img v-if="a" src="https://images.unsplash.com/photo-1648737851351-b40fce70e77e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1335&q=80">
    <img v-else src="https://images.unsplash.com/photo-1648721946556-b9266caf9370?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80">
  </div>
</template>
