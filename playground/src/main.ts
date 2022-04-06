/*
 * @Author: Simon
 * @Date: 2022-04-06 08:10:10
 * @LastEditTime: 2022-04-06 17:46:07
 * @FilePath: \vue-starport\playground\src\main.ts
 */
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})
app.use(router)
app.mount('#app')
