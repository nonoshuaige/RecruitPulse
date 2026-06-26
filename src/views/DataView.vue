<template>
  <div>
    <div class="kpi-row">
      <KpiCard :num="stats.pendingScreening" label="待筛选" color="orange" />
      <KpiCard :num="stats.pendingInterview" label="待面试" color="blue" />
      <KpiCard :num="stats.passed" label="已通过" color="green" />
    </div>

    <div class="section-title">候选人状态分布</div>
    <div class="candidate-card">
      <div ref="chartRef" style="width:100%;height:320px"></div>
    </div>

    <div class="section-title">详细统计</div>
    <div class="candidate-card">
      <van-cell-group inset>
        <van-cell title="候选人总数" :value="store.candidates.length" />
        <van-cell title="待筛选" :value="stats.pendingScreening" />
        <van-cell title="已通过筛选（待面试）" :value="stats.pendingInterview" />
        <van-cell title="已预约面试" :value="stats.scheduled" />
        <van-cell title="面试通过" :value="stats.passed" label="已入职候选人" />
        <van-cell title="已淘汰" :value="stats.eliminated" />
        <van-cell title="面试不通过" :value="stats.failed" />
      </van-cell-group>
    </div>

    <div style="height:40px"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useCandidateStore } from '@/stores/candidate.js'
import * as echarts from 'echarts'
import KpiCard from '@/components/KpiCard.vue'

const store = useCandidateStore()
const chartRef = ref(null)
let chartInstance = null

const stats = computed(() => {
  const list = store.candidates
  return {
    pendingScreening: list.filter(c => c.screeningStatus === 'pending').length,
    pendingInterview: list.filter(c => c.screeningStatus === 'passed' && c.interviewStatus === 'pending').length,
    scheduled: list.filter(c => c.interviewStatus === 'scheduled').length,
    passed: list.filter(c => c.interviewStatus === 'passed').length,
    eliminated: list.filter(c => c.screeningStatus === 'eliminated').length,
    failed: list.filter(c => c.interviewStatus === 'failed').length,
  }
})

function initChart() {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.dispose()
  chartInstance = echarts.init(chartRef.value)

  const s = stats.value
  const data = [
    { value: s.pendingScreening, name: '待筛选' },
    { value: s.pendingInterview, name: '待面试' },
    { value: s.scheduled, name: '已预约' },
    { value: s.passed, name: '已通过' },
    { value: s.eliminated, name: '已淘汰' },
    { value: s.failed, name: '面试不通过' },
  ].filter(d => d.value > 0)

  chartInstance.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}人 ({d}%)' },
    legend: { bottom: 0, itemWidth: 12, itemHeight: 12, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { formatter: '{b}\n{c}人', fontSize: 11 },
      emphasis: { scaleSize: 8 },
      data,
    }],
  })
}

onMounted(() => { nextTick(initChart) })
watch(stats, () => { nextTick(initChart) }, { deep: true })
</script>
