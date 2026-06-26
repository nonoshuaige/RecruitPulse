<template>
  <div class="slot-picker">
    <div class="slot-dates">
      <div class="section-title">选择日期</div>
      <van-checkbox-group v-model="selectedDates" direction="horizontal">
        <van-checkbox v-for="d in dateOptions" :key="d" :name="d" shape="square" icon-size="16px">
          {{ formatDate(d) }}
        </van-checkbox>
      </van-checkbox-group>
    </div>

    <div class="slot-times" style="margin-top:12px">
      <div class="section-title">选择时段</div>
      <van-checkbox-group v-model="selectedTimeSlots" direction="horizontal">
        <van-checkbox name="09:00-10:00" shape="square" icon-size="14px">09:00-10:00</van-checkbox>
        <van-checkbox name="10:00-11:00" shape="square" icon-size="14px">10:00-11:00</van-checkbox>
        <van-checkbox name="11:00-12:00" shape="square" icon-size="14px">11:00-12:00</van-checkbox>
        <van-checkbox name="14:00-15:00" shape="square" icon-size="14px">14:00-15:00</van-checkbox>
        <van-checkbox name="15:00-16:00" shape="square" icon-size="14px">15:00-16:00</van-checkbox>
        <van-checkbox name="16:00-17:00" shape="square" icon-size="14px">16:00-17:00</van-checkbox>
      </van-checkbox-group>
    </div>

    <van-button block type="primary" size="small" style="margin-top:14px" @click="handleSave" :disabled="!selectedDates.length || !selectedTimeSlots.length">
      保存空闲时间
    </van-button>

    <div class="saved-slots" v-if="slots.length" style="margin-top:12px">
      <div class="section-title">已保存时段</div>
      <div v-for="s in slots" :key="s.date" class="slot-date-group">
        <span class="slot-date-label">{{ s.date }}</span>
        <span v-for="slot in s.slots" :key="slot" class="slot-tag selected" @click="$emit('remove', s.date, slot)">
          {{ slot }} ✕
        </span>
      </div>
      <van-button size="small" plain type="danger" @click="$emit('clear')" style="margin-top:8px">清空全部</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ slots: { type: Array, default: () => [] } })
const emit = defineEmits(['save', 'remove', 'clear'])

const selectedDates = ref([])
const selectedTimeSlots = ref([])

const dateOptions = computed(() => {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
})

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.getMonth() + 1}/${d.getDate()} ${week[d.getDay()]}`
}

function handleSave() {
  emit('save', [...selectedDates.value], [...selectedTimeSlots.value])
  selectedDates.value = []
  selectedTimeSlots.value = []
}
</script>

<style scoped>
.slot-dates :deep(.van-checkbox), .slot-times :deep(.van-checkbox) { margin: 4px 8px 4px 0; }
.slot-date-group { margin: 6px 0; }
.slot-date-label { font-size: 12px; color: var(--text-light); margin-right: 8px; }
</style>
