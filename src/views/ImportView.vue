<template>
  <div>
    <div style="padding:12px 16px">
      <van-button block type="primary" icon="plus" @click="showAdd = true">新增候选人</van-button>
    </div>

    <div v-if="store.candidates.length === 0" class="empty-state">
      <div class="empty-icon">📥</div>
      <div class="empty-text">暂无候选人，点击上方按钮录入</div>
    </div>

    <CandidateImportCard
      v-for="c in store.candidates"
      :key="c.id"
      :candidate="c"
      @delete="handleDelete(c.id)"
    />

    <van-dialog v-model:show="showAdd" title="新增候选人" show-cancel-button
      @confirm="handleAdd" @cancel="resetForm">
      <div style="padding:16px">
        <van-field v-model="form.name" label="姓名" placeholder="请输入姓名" />
        <van-field v-model="form.phone" label="手机号" placeholder="请输入手机号" type="tel" maxlength="11" />
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useCandidateStore } from '@/stores/candidate.js'
import { showToast, showConfirmDialog } from 'vant'
import CandidateImportCard from '@/components/CandidateImportCard.vue'

const store = useCandidateStore()
const showAdd = ref(false)
const form = reactive({ name: '', phone: '' })

function handleAdd() {
  const res = store.addCandidate(form.name, form.phone)
  showToast(res.msg)
  if (res.ok) resetForm()
  else return false  // prevent dialog close
}

function resetForm() { form.name = ''; form.phone = '' }

async function handleDelete(id) {
  try {
    await showConfirmDialog({ title: '确认删除', message: '删除后无法恢复，确定删除该候选人吗？' })
    store.removeCandidate(id)
    showToast('已删除')
  } catch {}
}
</script>
