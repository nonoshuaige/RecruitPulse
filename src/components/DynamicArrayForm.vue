<template>
  <div class="dynamic-array">
    <div v-for="(item, index) in modelValue" :key="index" class="array-item">
      <div class="array-item-header">
        <span class="array-item-index">{{ title }} #{{ index + 1 }}</span>
        <van-icon name="delete-o" color="#ee0a24" size="18" @click="remove(index)" />
      </div>
      <van-field
        v-for="field in fields"
        :key="field.key"
        :label="field.label"
        :placeholder="field.placeholder || '请输入'"
        :model-value="item[field.key] || ''"
        :rows="field.type === 'textarea' ? 2 : 1"
        :type="field.type === 'textarea' ? 'textarea' : 'text'"
        :autosize="field.type === 'textarea'"
        @update:model-value="updateField(index, field.key, $event)"
        size="small"
        label-width="60px"
      />
    </div>
    <div class="array-add" @click="add">
      <van-icon name="plus" /> 添加{{ title }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Array, required: true },
  fields: { type: Array, required: true },
  title: { type: String, default: '项目' },
  template: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['update:modelValue'])

function add() {
  const arr = [...props.modelValue, { ...props.template }]
  emit('update:modelValue', arr)
}
function remove(index) {
  const arr = [...props.modelValue]
  arr.splice(index, 1)
  emit('update:modelValue', arr)
}
function updateField(index, key, value) {
  const arr = props.modelValue.map((item, i) => i === index ? { ...item, [key]: value } : item)
  emit('update:modelValue', arr)
}
</script>

<style scoped>
.array-item { background: #f9fafb; border-radius: 8px; padding: 8px; margin-bottom: 8px; }
.array-item-header { display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; }
.array-item-index { font-size: 12px; font-weight: 600; color: var(--text-light); }
.array-add { text-align: center; padding: 10px; color: var(--primary); font-size: 13px; cursor: pointer; border: 1px dashed var(--border); border-radius: 8px; margin-top: 6px; }
</style>
