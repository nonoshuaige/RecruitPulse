<template>
  <div class="structured-view">
    <div class="info-grid">
      <div class="info-item"><span class="info-label">性别</span><span class="info-value">{{ data.gender || '未知' }}</span></div>
      <div class="info-item"><span class="info-label">年龄</span><span class="info-value">{{ data.age || '未知' }}</span></div>
      <div class="info-item"><span class="info-label">邮箱</span><span class="info-value">{{ data.email || '未知' }}</span></div>
    </div>

    <div class="structured-block" v-if="data.education?.length">
      <div class="block-title">学历</div>
      <div v-for="(e, i) in data.education" :key="i" class="block-row">
        <span class="label">学校</span>{{ e.school }}<br v-if="e.major || e.period" />
        <span v-if="e.major"><span class="label">专业</span>{{ e.major }}</span>
        <span v-if="e.period"><span class="label">时间</span>{{ e.period }}</span>
      </div>
    </div>

    <div class="structured-block" v-if="data.work?.length">
      <div class="block-title">工作经历</div>
      <div v-for="(w, i) in data.work" :key="i" class="block-row">
        <strong>{{ w.company }}</strong> {{ w.role }}
        <span v-if="w.period" class="period">{{ w.period }}</span>
        <div v-if="w.content" class="work-content">{{ w.content }}</div>
      </div>
    </div>

    <div class="structured-block" v-if="data.project?.length">
      <div class="block-title">项目经历</div>
      <div v-for="(p, i) in data.project" :key="i" class="block-row">
        <strong>{{ p.name }}</strong> {{ p.role }}
        <span v-if="p.period" class="period">{{ p.period }}</span>
        <div v-if="p.content" class="work-content">{{ p.content }}</div>
      </div>
    </div>

    <div class="empty-state" v-if="isEmpty">
      <div class="empty-text">暂无结构化数据，请先在导入页进行AI解析</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ data: { type: Object, default: () => ({}) } })
const isEmpty = computed(() => {
  const d = props.data
  return !d.gender && !d.age && !d.email && (!d.education || d.education.length === 0) && (!d.work || d.work.length === 0) && (!d.project || d.project.length === 0)
})
</script>

<style scoped>
.info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px; }
.info-item { background: #f9fafb; border-radius: 6px; padding: 8px 10px; text-align: center; }
.info-label { display: block; font-size: 11px; color: var(--text-light); margin-bottom: 2px; }
.info-value { font-size: 14px; font-weight: 500; color: var(--text); }
.period { font-size: 11px; color: var(--text-light); margin-left: 6px; }
.work-content { font-size: 12px; color: var(--text-light); margin-top: 4px; line-height: 1.5; }
</style>
