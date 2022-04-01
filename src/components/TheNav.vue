<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div p4 border="b gray-400/10" mb-4 flex="~" items-center>
    <div text-lg font-mono>
      {{ route.path }}
    </div>
    <div flex-auto />
    <div flex="~ gap1" justify-center>
      <router-link btn to="/">
        /
      </router-link>
      <router-link btn to="/foo">
        /foo
      </router-link>
      <!-- <router-link btn to="/bar">
        /bar
      </router-link> -->
    </div>
  </div>
</template>
