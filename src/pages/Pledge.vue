<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Staking</span><span style="width:32px"></span></div>
    <div class="page-content">
      <div class="staking-banner"><h2>💎 Earn with Staking</h2><p>Lock your tokens and earn passive income daily</p></div>
      <div v-for="plan in plans" :key="plan.name" class="card mb-12">
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center gap-8"><div class="coin-icon" :style="{background:plan.color}">{{ plan.coin.slice(0,2) }}</div><div><div class="fw-600 fs-14">{{ plan.coin }}</div><div class="fs-12 text-muted">{{ plan.name }}</div></div></div>
          <span class="badge badge-green">{{ plan.apy }}% APY</span></div>
        <div class="flex justify-between fs-13 mb-4"><span class="text-muted">Lock Period</span><span>{{ plan.period }} Days</span></div>
        <div class="flex justify-between fs-13 mb-4"><span class="text-muted">Min Amount</span><span>{{ plan.min }} {{ plan.coin }}</span></div>
        <button class="btn btn-primary btn-sm mt-8">Stake Now</button>
      </div>
    </div>
  </div>
</template>
<script setup>
const plans = [
  { name: 'Flexible', coin: 'USDT', apy: '5.0', period: '30', min: '50', color: '#26A17B' },
  { name: 'Standard', coin: 'BTC', apy: '3.5', period: '60', min: '0.001', color: '#F7931A' },
  { name: 'Premium', coin: 'ETH', apy: '4.2', period: '90', min: '0.01', color: '#627EEA' },
  { name: 'High Yield', coin: 'SOL', apy: '8.0', period: '30', min: '1', color: '#9945FF' },
]
</script>
<style scoped>
.staking-banner{padding:24px 20px;background:linear-gradient(135deg,#F7931A,#FFB84D);border-radius:var(--radius-lg);color:white;margin-bottom:16px}
.staking-banner h2{font-size:20px;margin-bottom:4px}
.staking-banner p{font-size:13px;opacity:0.85}
</style>
