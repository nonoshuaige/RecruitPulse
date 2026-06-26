<template>
  <div class="candidate-card" @click="$router.push(`/process/${candidate.id}`)">
    <div class="card-header">
      <div>
        <span class="name">{{ candidate.name }}</span>
        <span class="phone">{{ candidate.phone }}</span>
      </div>
      <span :class="['tag', statusClass]">{{ statusText }}</span>
    </div>

    <div class="tag-row">
      <span v-if="candidate.selectedInterviewSlot" class="tag success">📅 {{ candidate.selectedInterviewSlot }}</span>
      <span v-if="candidate.structuredData?.education?.[0]" class="tag">
        {{ candidate.structuredData.education[0].school }}
      </span>
      <span v-if="candidate.structuredData?.work?.[0]" class="tag">
        {{ candidate.structuredData.work[0].company }} {{ candidate.structuredData.work[0].role }}
      </span>
    </div>

    <!-- 待预约：可选时段 -->
    <div v-if="candidate.interviewStatus === 'pending' && availableSlots.length" style="margin-top:8px">
      <div style="font-size:11px;color:var(--text-light);margin-bottom:4px">可选时段:</div>
      <div class="slot-options">
        <span v-for="slot in availableSlots" :key="slot" :class="['slot-tag', { selected: selectedSlot === slot }]"
          @click.stop="selectedSlot = slot">
          {{ slot }}
        </span>
      </div>
      <van-button size="small" type="primary" block style="margin-top:6px"
        :disabled="!selectedSlot" @click.stop="handleSchedule">
        确认预约
      </van-button>
    </div>

    <!-- 已预约：显示时间 + 等待预约 -->
    <div v-if="candidate.interviewStatus === 'scheduled'" style="margin-top:6px">
      <span style="font-size:12px;color:var(--primary)">⏰ 已预约，等待预约</span>
    </div>

    <!-- 待评价：显示时间 + 去评价按钮 -->
    <div v-if="candidate.interviewStatus === 'completed'" style="margin-top:6px">
      <span style="font-size:12px;color:var(--warning)">📝 面试已完成，待评价</span>
    </div>

    <!-- 已完成：显示通过/不通过 + 评价摘要 -->
    <div v-if="['passed','failed'].includes(candidate.interviewStatus)" style="margin-top:6px">
      <div :style="{fontSize:'12px',color:candidate.interviewStatus==='passed'?'var(--success)':'var(--danger)',marginBottom:'4px'}">
        {{ candidate.interviewStatus === 'passed' ? '✅ 面试通过' : '❌ 面试不通过' }}
      </div>
      <div v-if="candidate.interviewEvaluation" style="font-size:11px;color:var(--text-light);line-height:1.5">
        💬 {{ candidate.interviewEvaluation }}
      </div>
    </div>

    <div style="text-align:right;font-size:11px;color:var(--primary);margin-top:6px">查看详情 →</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCandidateStore } from '@/stores/candidate.js'
import { useProcessStore } from '@/stores/process.js'
import { showToast } from 'vant'

const props = defineProps({ candidate: { type: Object, required: true } })
const store = useCandidateStore()
const processStore = useProcessStore()
const selectedSlot = ref(null)

const statusMap = { pending: '待预约', scheduled: '已预约', completed: '待评价', passed: '已通过', failed: '未通过' }
const statusClassMap = { pending: 'warning', scheduled: 'primary', completed: 'warning', passed: 'success', failed: 'danger' }

const statusText = computed(() => statusMap[props.candidate.interviewStatus] || '待预约')
const statusClass = computed(() => statusClassMap[props.candidate.interviewStatus] || 'warning')

const availableSlots = computed(() => processStore.getAllSlots())

function handleSchedule() {
  if (selectedSlot.value) {
    store.scheduleInterview(props.candidate.id, selectedSlot.value)
    showToast(`已预约 ${selectedSlot.value}`)
  }
}
</script>
