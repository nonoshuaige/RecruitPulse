<template>
  <div>
    <div class="search-area" style="padding: 12px 16px">
      <van-search v-model="searchQuery" placeholder="输入筛选条件，如：有电商高并发经验的Java后端、大厂背景、稳定性好..." shape="round" />
      <van-button block type="primary" icon="smile-comment-o" @click="handleSearch"
        :loading="searching" :disabled="!store.candidates.some(c => c.parseStatus === 'done')">
        开始智能筛选
      </van-button>
    </div>

    <div v-if="screeningResults.length" class="section-title">
      筛选结果（{{ screeningResults.length }}人，按匹配度降序）
    </div>

    <ScreeningCard v-for="c in screeningResults" :key="c.id" :candidate="c" />

    <div v-if="!searching && screeningResults.length === 0 && hasSearched" class="empty-state">
      <div class="empty-icon">🔍</div>
      <div class="empty-text">无筛选结果，请先在导入页完成AI解析</div>
    </div>

    <div v-if="!hasSearched" class="empty-state">
      <div class="empty-icon">🔍</div>
      <div class="empty-text">{{ store.candidates.filter(c => c.parseStatus === 'done').length }}位候选人待筛选，请输入条件开始</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCandidateStore } from '@/stores/candidate.js'
import ScreeningCard from '@/components/ScreeningCard.vue'

const store = useCandidateStore()
const searchQuery = ref('')
const searching = ref(false)
const screeningResults = ref([])
const hasSearched = ref(false)

function handleSearch() {
  searching.value = true
  setTimeout(() => {
    screeningResults.value = store.doScreening(searchQuery.value)
    searching.value = false
    hasSearched.value = true
  }, 800)
}
</script>
