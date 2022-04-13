<script setup lang="ts">
import { images } from '~/composables/data'

const data = reactive(images.map((u, i) => ({
  index: i,
  list: Math.random() < 0.5 ? 1 : 0,
})))

const list0 = computed(() => data.filter(i => i.list === 0))
const list1 = computed(() => data.filter(i => i.list === 1))

function toggle(index: number) {
  data[index].list = data[index].list === 0 ? 1 : 0
}

const mounted = ref(false)

onMounted(() => {
  nextTick(() => {
    mounted.value = true
  })
})
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
        <Starport
          v-for="i of list0" :key="i.index +10" :port="String(i.index)"
          :initial-props="mounted ? { class: 'mb--30' } : {}"
          h-30 m2 transition-all duration-800
        >
          <MyComponent :index="i.index" rounded @click="toggle(i.index)" />
        </Starport>
      </div>
      <div>
        <div font-bold mb-2>
          List B
        </div>
        <Starport
          v-for="i of list1" :key="i.index" :port="String(i.index)"
          :initial-props="mounted ? { class: 'mb--40' } : {}"
          h-40 transition-all duration-800
        >
          <MyComponent :index="i.index" @click="toggle(i.index)" />
        </Starport>
      </div>
    </div>
  </div>
</template>
