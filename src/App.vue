<template>
  <div class="app">
    <header class="app-header">
      <h2>{{ tabTitle }}</h2>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <van-tabbar v-model="activeTab" route fixed>
      <van-tabbar-item to="/import" icon="add-o">导入</van-tabbar-item>
      <van-tabbar-item to="/screening" icon="search">筛选</van-tabbar-item>
      <van-tabbar-item to="/process" icon="todo-list-o">流程</van-tabbar-item>
      <van-tabbar-item to="/data" icon="chart-trending-o">数据</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeTab = computed({
  get: () => {
    const tabMap = { '/import': 0, '/screening': 1, '/process': 2, '/data': 3 }
    const base = '/' + route.path.split('/')[1]
    return tabMap[base] ?? 0
  },
  set: () => {},
})

const tabTitle = computed(() => {
  const map = {
    '/import': '候选人导入',
    '/screening': 'AI 智能筛选',
    '/process': '面试流程',
    '/data': '数据看板',
  }
  const base = '/' + route.path.split('/')[1]
  return map[base] || 'RecruitPulse'
})
</script>
