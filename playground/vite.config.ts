/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      'vue-starport': path.resolve(__dirname, '../src/index.ts'),
    },
  },
  plugins: [
    Vue({
      reactivityTransform: true,
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      importMode: 'sync',
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        '@vueuse/core',
      ],
      dts: true,
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: true,
      types: [
        {
          from: 'vue-router',
          names: [
            'RouterView',
            'RouterLink',
          ],
        },
        {
          from: 'vue-starport',
          names: [
            'Starport',
            'StarportCarrier',
          ],
        },
      ],
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss({
      configFile: path.resolve(__dirname, 'uno.config.ts'),
    }),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
  },
})
