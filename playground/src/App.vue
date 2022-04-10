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
