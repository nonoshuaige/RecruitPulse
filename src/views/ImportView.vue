<template>
  <div>
    <div style="padding:12px 16px">
      <van-button block type="primary" icon="plus" @click="showAdd = true">新增候选人</van-button>
    </div>

    <div v-if="store.candidates.length === 0" class="empty-state">
      <div class="empty-icon">📥</div>
      <div class="empty-text">暂无候选人，点击上方按钮录入</div>
    </div>

    <div ref="listTop">
      <CandidateImportCard
        v-for="c in store.candidates"
        :key="c.id"
        :candidate="c"
        @delete="handleDelete(c.id)"
      />
    </div>

    <van-popup v-model:show="showAdd" position="center" round :style="{ width: '85%', padding: '20px' }">
      <h3 style="text-align:center; margin-bottom:12px">新增候选人</h3>
      <van-field v-model="form.name" label="姓名" placeholder="请输入姓名" />
      <van-field v-model="form.phone" label="手机号" placeholder="请输入手机号" type="tel" maxlength="11" />
      <div style="display:flex; gap:12px; margin-top:16px">
        <van-button block @click="handleCancel">取消</van-button>
        <van-button block type="primary" @click="handleAdd">确认录入</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useCandidateStore } from '@/stores/candidate.js'
import { showToast, showConfirmDialog } from 'vant'
import CandidateImportCard from '@/components/CandidateImportCard.vue'

const store = useCandidateStore()
const showAdd = ref(false)
const form = reactive({ name: '', phone: '' })
const listTop = ref(null)

function resetForm() { form.name = ''; form.phone = '' }

function handleCancel() {
  resetForm()
  showAdd.value = false
}

function handleAdd() {
  const res = store.addCandidate(form.name, form.phone)
  showToast(res.msg)
  if (!res.ok) return
  resetForm()
  showAdd.value = false
  nextTick(() => {
    listTop.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

async function handleDelete(id) {
  try {
    await showConfirmDialog({ title: '确认删除', message: '删除后无法恢复，确定删除该候选人吗？' })
    store.removeCandidate(id)
    showToast('已删除')
  } catch {}
}
</script>
