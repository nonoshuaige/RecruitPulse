<template>
  <div :class="['kpi-card', color]">
    <div class="kpi-num">{{ num }}</div>
    <div class="kpi-label">{{ label }}</div>
  </div>
</template>

<script setup>
defineProps({
  num: { type: Number, default: 0 },
  label: { type: String, default: '' },
  color: { type: String, default: 'blue' },
})
</script>
