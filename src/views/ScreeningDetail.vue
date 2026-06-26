<template>
  <div v-if="candidate">
    <div style="padding:0 16px">
      <van-notice-bar left-icon="info-o" scrollable color="#1989fa" background="#ecf5ff">
        综合评分: {{ candidate.screeningScore || '—' }} 分 |
        硬性: {{ candidate._screeningDetail?.hardScore || '—' }} |
        经验: {{ candidate._screeningDetail?.expScore || '—' }} |
        稳定: {{ candidate._screeningDetail?.stabilityScore || '—' }}
      </van-notice-bar>
    </div>

    <div class="candidate-card" v-if="candidate._screeningDetail?.reason">
      <div style="font-size:13px;color:var(--text)">💡 {{ candidate._screeningDetail.reason }}</div>
      <div v-if="candidate._screeningDetail?.risks" style="font-size:12px;color:var(--danger);margin-top:4px">
        ⚠️ {{ candidate._screeningDetail.risks }}
      </div>
    </div>

    <div class="section-title">基本信息</div>
    <div class="candidate-card">
      <div class="info-grid">
        <div class="info-item"><span class="info-label">姓名</span><span class="info-value">{{ candidate.name }}</span></div>
        <div class="info-item"><span class="info-label">手机</span><span class="info-value">{{ candidate.phone }}</span></div>
        <div class="info-item"><span class="info-label">状态</span><span class="info-value">{{ statusMap[candidate.screeningStatus] }}</span></div>
      </div>
    </div>

    <div class="section-title">结构化信息</div>
    <div class="candidate-card">
      <StructuredDataView :data="candidate.structuredData" />
    </div>

    <div class="section-title">聊天记录</div>
    <div class="candidate-card">
      <div v-if="candidate.chatRecords.length === 0" style="color:var(--text-light);font-size:13px">暂无聊天记录</div>
      <pre v-else class="json-display">{{ JSON.stringify(candidate.chatRecords, null, 2) }}</pre>
    </div>

    <div class="action-area" v-if="candidate.screeningStatus === 'pending'">
      <div class="section-title">操作</div>
      <div class="candidate-card">
        <van-field v-model="reason" type="textarea" rows="2" placeholder="淘汰理由（选填）" autosize />
        <div style="display:flex;gap:10px;margin-top:12px">
          <van-button type="danger" block @click="handleEliminate" :loading="acting">❌ 淘汰</van-button>
          <van-button type="success" block @click="handlePass" :loading="acting">✅ 通过筛选</van-button>
        </div>
      </div>
    </div>

    <div v-else class="candidate-card" style="text-align:center">
      <span :class="candidate.screeningStatus==='passed'?'tag success':'tag danger'" style="font-size:14px">
        {{ candidate.screeningStatus === 'passed' ? '✅ 已通过筛选' : '❌ 已淘汰' }}
      </span>
      <div v-if="candidate.screeningFeedback" style="margin-top:8px;font-size:13px;color:var(--text-light)">
        理由: {{ candidate.screeningFeedback }}
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
import { useRoute, useRouter } from 'vue-router'
import { useCandidateStore } from '@/stores/candidate.js'
import { showToast } from 'vant'
import StructuredDataView from '@/components/StructuredDataView.vue'

const route = useRoute()
const router = useRouter()
const store = useCandidateStore()
const candidate = computed(() => store.getById(route.params.id))
const reason = ref('')
const acting = ref(false)

const statusMap = { pending: '待筛选', passed: '已通过', eliminated: '已淘汰' }

function handlePass() {
  acting.value = true
  setTimeout(() => {
    store.passScreening(candidate.value.id)
    showToast('已通过筛选')
    acting.value = false
  }, 300)
}

function handleEliminate() {
  acting.value = true
  setTimeout(() => {
    store.eliminateScreening(candidate.value.id, reason.value)
    showToast('已淘汰')
    acting.value = false
  }, 300)
}
</script>

<style scoped>
.info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
.info-item { background: #f9fafb; border-radius: 6px; padding: 8px 10px; text-align: center; }
.info-label { display: block; font-size: 11px; color: var(--text-light); margin-bottom: 2px; }
.info-value { font-size: 14px; font-weight: 500; color: var(--text); }
.action-area { padding-bottom: 16px; }

.json-display {
  font-family: 'SF Mono', 'Menlo', 'Consolas', monospace;
  font-size: 11px;
  line-height: 1.5;
  color: #323233;
  background: #f7f8fa;
  padding: 10px 12px;
  border-radius: 6px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 360px;
  overflow-y: auto;
}
</style>
