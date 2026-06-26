<template>
  <div class="candidate-card">
    <!-- ─── 头部 ─── -->
    <div class="card-header">
      <div>
        <span class="name">{{ candidate.name }}</span>
        <span class="phone">{{ candidate.phone }}</span>
      </div>
      <div class="tag-row">
        <span :class="['tag', candidate.parseStatus === 'done' ? 'success' : 'warning']">
          {{ candidate.parseStatus === 'done' ? '已解析' : '待解析' }}
        </span>
        <span class="tag" v-if="candidate.chatRecords.length">聊天已导入</span>
      </div>
    </div>

    <!-- ─── 操作按钮 ─── -->
    <div class="card-actions">
      <input ref="chatInput" type="file" accept=".json" style="display:none" @change="onImportChat" />
      <van-button size="small" icon="description-o" type="primary" plain @click="$refs.chatInput.click()">
        聊天记录
      </van-button>

      <van-button size="small" icon="smile-comment-o" type="success"
        @click="handleAiParse" :loading="parsing" :disabled="!canParse">
        AI 解析
      </van-button>

      <van-button size="small" icon="delete-o" type="danger" plain @click="emit('delete', candidate.id)" />
    </div>

    <!-- ─── 解析提示 ─── -->
    <div class="parse-hint" v-if="canParse || candidate.parseStatus === 'done'">
      <span v-if="candidate.parseStatus !== 'done'">🔍 {{ parseSourceHint }}</span>
      <span v-else style="color:var(--success)">✅ 解析完成 — {{ parseDoneSourceHint }}</span>
    </div>

    <!-- ─── 聊天记录区域（折叠） ─── -->
    <div class="section-block" v-if="candidate.chatRecords.length">
      <div class="section-header" @click="showChat = !showChat">
        <span>💬 聊天记录（{{ candidate.chatRecords.length }}条）</span>
        <van-icon :name="showChat ? 'arrow-up' : 'arrow-down'" />
      </div>
      <div v-if="showChat" class="section-body">
        <pre class="json-display">{{ JSON.stringify(candidate.chatRecords, null, 2) }}</pre>
      </div>
    </div>

    <!-- ─── AI 解析结果（独立的蓝色边框区域） ─── -->
    <div class="parse-result-box" v-if="candidate.parseStatus === 'done'">
      <div class="parse-result-header">🤖 AI 结构化解析结果</div>
      <div class="parse-result-body">
        <StructuredDataView :data="candidate.structuredData" />
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:4px">
        <van-button size="small" icon="edit" plain type="primary" @click="showEdit = true">
          编辑修正
        </van-button>
        <van-button size="small" icon="envelope-o" plain type="warning" @click="sendToCandidate" :loading="sending">
          推送候选人确认
        </van-button>
      </div>
    </div>

    <!-- ─── 编辑弹窗 ─── -->
    <van-popup v-model:show="showEdit" position="bottom" round :style="{ height: '85%' }">
      <div class="edit-panel">
        <h3>编辑结构化信息 - {{ candidate.name }}</h3>
        <van-field label="性别" v-model="editData.gender" placeholder="男/女" />
        <van-field label="年龄" v-model.number="editData.age" type="number" placeholder="年龄" />
        <van-field label="邮箱" v-model="editData.email" placeholder="邮箱地址" />

        <div class="section-title">📚 学历（最多2条）</div>
        <DynamicArrayForm v-model="editData.education" title="学历"
          :fields="eduFields" :template="blankEdu" />

        <div class="section-title">💼 工作经历（最多2条）</div>
        <DynamicArrayForm v-model="editData.work" title="工作经历"
          :fields="workFields" :template="blankWork" />

        <div class="section-title">📋 项目经历（最多2条）</div>
        <DynamicArrayForm v-model="editData.project" title="项目"
          :fields="projFields" :template="blankProj" />

        <div style="padding:16px">
          <van-button block type="primary" @click="saveEdit">保存</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useCandidateStore } from '@/stores/candidate.js'
import { showToast } from 'vant'
import StructuredDataView from './StructuredDataView.vue'
import DynamicArrayForm from './DynamicArrayForm.vue'

const props = defineProps({ candidate: { type: Object, required: true } })
const emit = defineEmits(['delete'])
const store = useCandidateStore()

const showChat = ref(false)
const showEdit = ref(false)
const parsing = ref(false)
const sending = ref(false)
const editData = reactive({ gender: '', age: null, email: '', education: [], work: [], project: [] })

const canParse = computed(() => {
  return props.candidate.chatRecords.some(r => r.type === 'resume')
})
const parseSourceHint = computed(() => {
  const c = props.candidate
  const resumeCount = c.chatRecords.filter(r => r.type === 'resume').length
  return resumeCount ? `将解析: 聊天中${resumeCount}条简历信息` : '请先导入聊天记录'
})
const parseDoneSourceHint = computed(() => {
  const c = props.candidate
  if (c.chatRecords.some(r => r.type === 'resume')) return '来自聊天记录'
  return ''
})

const eduFields = [{ key: 'school', label: '学校' }, { key: 'major', label: '专业' }, { key: 'period', label: '时间' }]
const workFields = [{ key: 'company', label: '公司' }, { key: 'role', label: '岗位' }, { key: 'period', label: '时间' }, { key: 'content', label: '工作内容', type: 'textarea' }]
const projFields = [{ key: 'name', label: '项目名' }, { key: 'period', label: '时间' }, { key: 'role', label: '角色' }, { key: 'content', label: '内容', type: 'textarea' }]
const blankEdu = { school: '', major: '', period: '' }
const blankWork = { company: '', role: '', period: '', content: '' }
const blankProj = { name: '', period: '', role: '', content: '' }

// ─── 文件导入 ───
function onImportChat(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const records = JSON.parse(ev.target.result)
      if (!Array.isArray(records)) throw new Error('必须是JSON数组')
      for (const r of records) {
        if (!['hr', 'candidate'].includes(r.role)) throw new Error(`role必须为hr或candidate，收到: ${r.role}`)
        if (!r.content) throw new Error('content不能为空')
        if (r.type && !['chat', 'resume', 'file'].includes(r.type)) throw new Error(`type必须为chat/resume/file，收到: ${r.type}`)
        if (r.time && !/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(r.time)) throw new Error(`time格式错误，应为 YYYY-MM-DD HH:mm`)
      }
      store.importChatRecords(props.candidate.id, records)
      showToast(`已导入${records.length}条聊天记录`)
    } catch (err) {
      showToast('格式错误: ' + err.message)
    }
  }
  reader.readAsText(file)
  e.target.value = ''
}

// ─── AI 解析 ───
function handleAiParse() {
  parsing.value = true
  setTimeout(() => {
    store.aiParse(props.candidate.id)
    parsing.value = false
    showToast('AI解析完成')
  }, 600)
}

// ─── 编辑保存 ───
function saveEdit() {
  store.updateStructuredData(props.candidate.id, JSON.parse(JSON.stringify(editData)))
  showEdit.value = false
  showToast('已保存')
}

// ─── 发送确认 ───
function sendToCandidate() {
  sending.value = true
  setTimeout(() => {
    sending.value = false
    showToast('已发送给面试者确认')
  }, 500)
}

// ─── 同步编辑数据 ───
watch(() => props.candidate.structuredData, (val) => {
  if (val) Object.assign(editData, JSON.parse(JSON.stringify(val)))
}, { immediate: true })
watch(showEdit, (v) => {
  if (v && props.candidate.structuredData) {
    Object.assign(editData, JSON.parse(JSON.stringify(props.candidate.structuredData)))
  }
})
</script>

<style scoped>
.parse-hint { margin-top: 8px; padding: 6px 10px; background: #f0f7ff; border-radius: 6px; font-size: 12px; color: var(--primary); }
.section-block {
  margin-top: 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  background: #f9fafb;
  cursor: pointer;
}
.section-body {
  padding: 8px 12px;
  background: #fff;
}
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

/* 解析结果独立区域 */
.parse-result-box {
  margin-top: 10px;
  border: 2px solid var(--primary);
  border-radius: 8px;
  overflow: hidden;
}
.parse-result-header {
  background: linear-gradient(135deg, #1989fa, #07c160);
  color: #fff;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
}
.parse-result-body {
  padding: 10px 12px;
  background: #fafcff;
}

.edit-panel {
  padding: 16px;
  overflow-y: auto;
  height: 100%;
}
.edit-panel h3 {
  font-size: 15px;
  margin-bottom: 12px;
  text-align: center;
}
</style>
