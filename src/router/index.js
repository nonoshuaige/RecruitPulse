import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/import' },
  {
    path: '/import',
    name: 'Import',
    component: () => import('@/views/ImportView.vue'),
  },
  {
    path: '/screening',
    name: 'Screening',
    component: () => import('@/views/ScreeningView.vue'),
  },
  {
    path: '/screening/:id',
    name: 'ScreeningDetail',
    component: () => import('@/views/ScreeningDetail.vue'),
  },
  {
    path: '/process',
    name: 'Process',
    component: () => import('@/views/ProcessView.vue'),
  },
  {
    path: '/process/:id',
    name: 'ProcessDetail',
    component: () => import('@/views/ProcessDetail.vue'),
  },
  {
    path: '/data',
    name: 'Data',
    component: () => import('@/views/DataView.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
