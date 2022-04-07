<!--
 * @Author: Simon
 * @Date: 2022-04-06 23:08:26
 * @LastEditTime: 2022-04-07 09:33:55
 * @FilePath: \vue-starport\playground\src\App.vue
-->
<script setup lang="ts">
import { StarportCarrier } from 'vue-starport'
</script>

<template>
  <main font-sans text="center gray-700 dark:gray-200" relative>
    <TheNav />
    <router-view v-slot="{ Component }">
      <transition name="page-fade">
        <component
          :is="Component"
          absolute left-0 right-0 top-25
        />
      </transition>
    </router-view>
  </main>
  <StarportCarrier />
</template>

<style lang="css" >
::-webkit-scrollbar{
  background:transparent;
  width: 0;
  height: 10px;
}
::-webkit-scrollbar-thumb{
  border-radius: 5px;
  background-color: #e1e1e1;
  width: 0;
  height: 6px;
  border: 2px solid transparent;
  background-clip: content-box;
}
</style>