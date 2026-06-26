<template>
  <div class="candidate-card" @click="$router.push(`/screening/${candidate.id}`)">
    <div class="card-header">
      <div>
        <span class="name">{{ candidate.name }}</span>
        <span class="phone">{{ candidate.phone }}</span>
      </div>
      <div class="score-badge" v-if="candidate.screeningScore !== null">
        {{ candidate.screeningScore }}分
      </div>
    </div>

    <div class="score-bar" v-if="candidate._screeningDetail">
      <div class="score-num">{{ candidate.screeningScore }}</div>
      <div class="score-detail">
        <span>硬性 {{ candidate._screeningDetail.hardScore }}</span>
        <span>经验 {{ candidate._screeningDetail.expScore }}</span>
        <span>稳定 {{ candidate._screeningDetail.stabilityScore }}</span>
      </div>
    </div>

    <div v-if="candidate._screeningDetail?.reason" style="font-size:12px;color:var(--text-light);margin-top:4px">
      💡 {{ candidate._screeningDetail.reason }}
    </div>

    <div class="tag-row">
      <span v-if="candidate.structuredData?.education?.[0]" class="tag">
        {{ candidate.structuredData.education[0].school }}
      </span>
      <span v-if="candidate.structuredData?.work?.[0]" class="tag">
        {{ candidate.structuredData.work[0].company }}
      </span>
      <span v-for="(w, i) in (candidate.structuredData?.work || []).slice(0,2)" :key="i" class="tag">
        {{ w.role }}
      </span>
    </div>

    <div style="text-align:right;font-size:11px;color:var(--primary);margin-top:6px">查看详情 →</div>
  </div>
</template>

<script setup>
defineProps({ candidate: { type: Object, required: true } })
</script>

<style scoped>
.score-badge { background: linear-gradient(135deg, #1989fa, #07c160); color: #fff; font-size: 14px; font-weight: 700; padding: 4px 10px; border-radius: 16px; }
</style>
