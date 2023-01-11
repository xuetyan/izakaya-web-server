import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/getData.vue'
import RareCustom from '@/views/rareCustom.vue'
import NormalCustom from '@/views/normalCustom.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'getData',
      redirect: '/rare_custom',
      component: HomeView,
      children: [
        {
          path: '/rare_custom',
          name: 'rare_custom',
          component: RareCustom,
        }, {
          path: '/normal_custom',
          name: 'normal_custom',
          component: NormalCustom,
        }
      ]
    },
  ]
})

export default router
