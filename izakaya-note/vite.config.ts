import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// 引入@vitejs/plugin-legacy
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    base: "./",
    plugins: [vue(),
      vueJsx(),
      legacy({
        targets: ['defaults', 'not IE 11']
      })
    ],
    resolve: {
      extensions: ['.js', '.ts', '.vue', '.json'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },

    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP_BASE_API,
          changeOrigin: true,
          rewrite:  (path) => path.replace(/^\/api/, '')
        }
      }
    },
  })
}
