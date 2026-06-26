<template>
  <div>
    <div class="slot-picker-section">
      <div class="section-title" style="padding:0 0 8px 0">📅 面试官空闲时间</div>
      <SlotPicker :slots="processStore.interviewerSlots"
        @save="processStore.addSlots($event[0], $event[1])"
        @remove="processStore.removeSlot($event[0], $event[1])"
        @clear="processStore.clearSlots()" />
    </div>

    <van-tabs v-model:active="activeTab" sticky offset-top="0">
      <van-tab title="待预约" :badge="store.pendingInterview.length || ''" />
      <van-tab title="已预约" :badge="store.scheduledInterviews.length || ''" />
      <van-tab title="待评价" :badge="store.pendingEvaluation.length || ''" />
      <van-tab title="已完成" />
    </van-tabs>

    <InterviewCard v-for="c in currentList" :key="c.id" :candidate="c" />

    <div v-if="currentList.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-text">{{ emptyText }}</div>
    </div>

    <div style="height:40px"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCandidateStore } from '@/stores/candidate.js'
import { useProcessStore } from '@/stores/process.js'
import InterviewCard from '@/components/InterviewCard.vue'
import SlotPicker from '@/components/SlotPicker.vue'

const store = useCandidateStore()
const processStore = useProcessStore()
const activeTab = ref(0)

const currentList = computed(() => {
  if (activeTab.value === 0) return store.pendingInterview
  if (activeTab.value === 1) return store.scheduledInterviews
  if (activeTab.value === 2) return store.pendingEvaluation
  return store.completedInterviews
})

const emptyText = computed(() => {
  const map = [
    '暂无待预约的候选人，请先在筛选页通过筛选',
    '暂无已预约的面试',
    '暂无待评价的面试',
    '暂无已完成的面试',
  ]
  return map[activeTab.value] || '暂无数据'
})
</script>
