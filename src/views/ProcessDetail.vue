<template>
  <div v-if="candidate">
    <div class="candidate-card">
      <div class="card-header">
        <div>
          <span class="name">{{ candidate.name }}</span>
          <span class="phone">{{ candidate.phone }}</span>
        </div>
        <span :class="['tag', statusClass]">{{ statusText }}</span>
      </div>

      <div v-if="candidate.selectedInterviewSlot" style="margin-top:8px">
        <span style="font-size:13px;color:var(--text)">📅 面试时间: <strong>{{ candidate.selectedInterviewSlot }}</strong></span>
      </div>

      <div class="tag-row">
        <span v-if="candidate.structuredData?.education?.[0]" class="tag">
          {{ candidate.structuredData.education[0].school }}
        </span>
        <span v-if="candidate.structuredData?.work?.[0]" class="tag">
          {{ candidate.structuredData.work[0].company }}
        </span>
      </div>
    </div>

    <div class="section-title">结构化信息</div>
    <div class="candidate-card">
      <StructuredDataView :data="candidate.structuredData" />
    </div>

    <!-- 待预约：选时间 -->
    <div class="section-title" v-if="candidate.interviewStatus === 'pending' && availableSlots.length">
      选择面试时间
    </div>
    <div class="candidate-card" v-if="candidate.interviewStatus === 'pending' && availableSlots.length">
      <div class="slot-options">
        <span v-for="slot in availableSlots" :key="slot"
          :class="['slot-tag', { selected: selectedSlot === slot }]"
          @click="selectedSlot = slot">
          {{ slot }}
        </span>
      </div>
      <van-button block type="primary" style="margin-top:10px"
        :disabled="!selectedSlot" @click="handleSchedule">
        确认预约
      </van-button>
    </div>

    <div class="candidate-card" v-if="candidate.interviewStatus === 'pending' && !availableSlots.length">
      <div style="color:var(--text-light);font-size:13px;text-align:center">
        暂无可用时段，请先在上方录入面试官空闲时间
      </div>
    </div>

    <!-- 已预约：等待预约，可标记完成 -->
    <div v-if="candidate.interviewStatus === 'scheduled'" class="candidate-card" style="text-align:center">
      <div style="font-size:14px;color:var(--primary);margin-bottom:8px">⏰ 等待预约</div>
      <div style="font-size:12px;color:var(--text-light);margin-bottom:8px">
        面试时间: {{ candidate.selectedInterviewSlot }}
      </div>
      <van-button type="warning" block @click="handleMarkCompleted">
        模拟面试完成，开始评价
      </van-button>
    </div>

    <!-- 待评价：填写评价 -->
    <div class="section-title" v-if="candidate.interviewStatus === 'completed'">
      面试评价
    </div>
    <div class="candidate-card" v-if="candidate.interviewStatus === 'completed'">
      <div style="font-size:12px;color:var(--text-light);margin-bottom:8px">
        📅 面试时间: {{ candidate.selectedInterviewSlot }}
      </div>
      <van-field v-model="evaluation" type="textarea" rows="3"
        placeholder="输入面试评价..." autosize />
      <div style="display:flex;gap:10px;margin-top:12px">
        <van-button type="danger" block @click="handleFail">❌ 不通过</van-button>
        <van-button type="success" block @click="handlePass">✅ 通过</van-button>
      </div>
    </div>

    <!-- 已完成：显示结果 -->
    <div v-if="candidate.interviewStatus === 'passed' || candidate.interviewStatus === 'failed'" class="candidate-card" style="text-align:center">
      <div :style="{fontSize:'16px',color:candidate.interviewStatus==='passed'?'var(--success)':'var(--danger)'}">
        {{ candidate.interviewStatus === 'passed' ? '✅ 面试通过' : '❌ 面试不通过' }}
      </div>
      <div style="font-size:12px;color:var(--text-light);margin-top:6px">
        📅 面试时间: {{ candidate.selectedInterviewSlot }}
      </div>
      <div v-if="candidate.interviewEvaluation" style="margin-top:8px;font-size:13px;color:var(--text);text-align:left;background:#f7f8fa;padding:10px;border-radius:6px">
        <strong>💬 评价:</strong> {{ candidate.interviewEvaluation }}
      </div>
    </div>

    <div style="height:80px"></div>
  </div>
  <div v-else class="empty-state">
    <div class="empty-icon">🚫</div>
    <div class="empty-text">候选人不存在</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCandidateStore } from '@/stores/candidate.js'
import { useProcessStore } from '@/stores/process.js'
import { showToast } from 'vant'
import StructuredDataView from '@/components/StructuredDataView.vue'

const route = useRoute()
const store = useCandidateStore()
const processStore = useProcessStore()
const candidate = computed(() => store.getById(route.params.id))
const selectedSlot = ref(null)
const evaluation = ref('')

const statusMap = { pending: '待预约', scheduled: '已预约', completed: '待评价', passed: '已通过', failed: '未通过' }
const statusClassMap = { pending: 'warning', scheduled: 'primary', completed: 'warning', passed: 'success', failed: 'danger' }
const statusText = computed(() => statusMap[candidate.value?.interviewStatus] || '待预约')
const statusClass = computed(() => statusClassMap[candidate.value?.interviewStatus] || 'warning')

const availableSlots = computed(() => processStore.getAllSlots())

function handleSchedule() {
  if (selectedSlot.value && candidate.value) {
    store.scheduleInterview(candidate.value.id, selectedSlot.value)
    showToast('已预约')
    selectedSlot.value = null
  }
}

function handleMarkCompleted() {
  if (candidate.value) {
    store.completeInterview(candidate.value.id)
    showToast('面试已标记完成，请填写评价')
  }
}

function handlePass() {
  if (candidate.value) {
    store.passInterview(candidate.value.id, evaluation.value)
    showToast('面试通过')
  }
}

function handleFail() {
  if (candidate.value) {
    store.failInterview(candidate.value.id, evaluation.value)
    showToast('面试不通过')
  }
}
</script>
