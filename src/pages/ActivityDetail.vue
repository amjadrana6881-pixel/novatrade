<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">{{ detail.title }}</span><span style="width:32px"></span></div>
    <div class="page-content">
      <div class="detail-banner" :style="{background: detail.bg}"><h2>{{ detail.title }}</h2><p>{{ detail.subtitle }}</p></div>
      <div class="card mt-16"><h4 class="fs-15 fw-600 mb-12">📋 Activity Details</h4>
        <div v-for="(item, i) in detail.rules" :key="i" class="fs-13 text-secondary mb-8">{{ item }}</div></div>
      <div class="card mt-12"><h4 class="fs-15 fw-600 mb-12">🎯 Participation Rules</h4>
        <div v-for="(item, i) in detail.participation" :key="i" class="fs-13 text-secondary mb-8">{{ item }}</div></div>
      <div class="card mt-12"><h4 class="fs-15 fw-600 mb-12">⏰ Activity Period</h4>
        <p class="fs-13 text-secondary">{{ detail.period }}</p></div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const details = {
  carnival: { title: '🎉 Grand Carnival', subtitle: 'Trade & win big prizes', bg: 'linear-gradient(135deg, #FF6B9D, #C850C0)', period: 'Jan 1, 2026 – Mar 31, 2026', rules: ['🏆 Trade volume ranking competition', '💰 Top 10 traders share 10,000 USDT prize', '📊 Minimum trade volume: 1,000 USDT', '🎁 All participants receive 50 NT tokens'], participation: ['1. Register and complete KYC verification', '2. Make a minimum deposit of 50 USDT', '3. Trade on Spot or Contract markets', '4. Rankings updated daily at 00:00 UTC'] },
  consultant: { title: '💼 Consultant Salary', subtitle: 'Earn monthly income as consultant', bg: 'linear-gradient(135deg, #1A3A8A, #1A6CFF)', period: 'Jan 1, 2026 – Dec 31, 2026', rules: ['💵 V3+ users eligible for monthly salary', '📈 Salary based on team performance', '🏅 V3: 200 USDT/month, V4: 500 USDT/month', '👑 V5+: 1000+ USDT/month'], participation: ['1. Achieve V3 or higher VIP level', '2. Maintain active team of 30+ members', '3. Salary distributed on 1st of each month', '4. Must maintain level requirements'] },
  dinner: { title: '🍽️ Dinner Reimbursement', subtitle: 'VIP dining benefit', bg: 'linear-gradient(135deg, #00856F, #00C087)', period: 'Jan 1, 2026 – Dec 31, 2026', rules: ['🍷 V5+ users receive monthly dining allowance', '💳 V5: 50 USDT, V6: 100 USDT', '🥂 V7: 200 USDT, V8: 500 USDT', '📸 Submit receipt for reimbursement'], participation: ['1. Must be V5 or higher VIP level', '2. Submit dining receipts via Service Chat', '3. Reimbursement credited within 48 hours', '4. Maximum one claim per month'] }
}
const detail = computed(() => details[route.params.id] || details.carnival)
</script>
<style scoped>
.detail-banner{padding:32px 24px;border-radius:var(--radius-lg);color:white}
.detail-banner h2{font-size:22px;margin-bottom:8px}
.detail-banner p{opacity:0.85;font-size:14px}
</style>
