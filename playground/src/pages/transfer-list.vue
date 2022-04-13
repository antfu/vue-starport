<script setup lang="ts">
import { images } from '~/composables/data'

const data = reactive(images.map((u, i) => ({
  index: i,
  list: 0,
})))

const list0 = computed(() => data.filter(i => i.list === 0))
const list1 = computed(() => data.filter(i => i.list === 1))

function toggle(index: number) {
  data[index].list = data[index].list === 0 ? 1 : 0
}
</script>

<template>
  <div>
    <div grid="~ cols-2">
      <div>
        <div>List 0</div>
        <Starport
          v-for="i of list0" :key="i.index" :port="String(i.index)"
          h-30
        >
          <MyComponent :index="i.index" @click="toggle(i.index)" />
        </Starport>
      </div>
      <div>
        <div>List 0</div>
        <Starport
          v-for="i of list1" :key="i.index" :port="String(i.index)"
          h-30
        >
          <MyComponent :index="i.index" @click="toggle(i.index)" />
        </Starport>
      </div>
    </div>
  </div>
</template>
