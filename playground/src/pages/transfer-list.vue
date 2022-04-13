<script setup lang="ts">
import { images } from '~/composables/data'

const data = reactive(images.map((u, i) => ({
  index: i,
  list: Math.random() < 0.5 ? 1 : 0,
})))

const listA = computed(() => data.filter(i => i.list === 0))
const listB = computed(() => data.filter(i => i.list === 1))

function toggle(index: number) {
  data[index].list = data[index].list === 0 ? 1 : 0
}
</script>

<template>
  <div>
    <div flex="~ gap2" justify-center>
      <RouterLink btn to="/" saturate-0 class="back-btn">
        Back
      </RouterLink>
    </div>
    <div grid="~ cols-2" w-200 ma p4>
      <div>
        <div font-bold mb-2>
          List A
        </div>
        <TransitionGroup name="proxy-list-a">
          <Starport
            v-for="i of listA" :key="i.index" :port="String(i.index)"
            h-30 m2
          >
            <MyComponent :index="i.index" rounded @click="toggle(i.index)" />
          </Starport>
        </TransitionGroup>
      </div>
      <div>
        <div font-bold mb-2>
          List B
        </div>
        <TransitionGroup name="proxy-list-b">
          <Starport
            v-for="i of listB" :key="i.index" :port="String(i.index)"
            h-40
          >
            <MyComponent :index="i.index" @click="toggle(i.index)" />
          </Starport>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<style>
.proxy-list-a-enter-active,
.proxy-list-a-leave-active,
.proxy-list-b-enter-active,
.proxy-list-b-leave-active {
  transition: all 0.8s ease;
}

.proxy-list-a-enter-from,
.proxy-list-a-leave-to {
  margin-bottom: -7.5rem !important;
}
.proxy-list-b-enter-from,
.proxy-list-b-leave-to {
  margin-bottom: -10rem !important;
}
</style>
