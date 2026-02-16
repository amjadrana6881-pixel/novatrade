<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Upgrade</span><span style="width:32px"></span></div>
    <div class="page-content">
      <div class="profile-card-upgrade"><div class="avatar-sm"><svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
        <div class="text-center mt-8"><div class="fs-24 fw-700 font-heading">V</div><div class="fs-12 text-muted">User Grade</div></div>
      </div>
      <table class="data-table" style="margin-top:16px;"><thead><tr><th>Grade</th><th>Assets</th><th>Friends</th><th>Unlock</th><th>Limit</th></tr></thead>
        <tbody><tr v-for="tier in tiers" :key="tier.grade"><td class="fw-600">{{tier.grade}}</td><td>{{tier.assets}}</td><td>{{tier.friends}}</td><td>{{tier.unlock}}</td><td>{{tier.limit}}</td></tr></tbody></table>
      <div class="card mt-16"><h4 class="fs-15 fw-600">🏆 Level Promotion Mechanism</h4>
        <div class="mt-8 fs-13 text-secondary"><p><strong>I. Upgrade Requirements:</strong></p><p class="mt-4">💰 Personal Funds: Reach required asset standard (USDT balance or entrusted assets)</p><p class="mt-4">👥 Active Level-1 Friends: Must have specified active users (each ≥ 50 USDT)</p>
          <p class="mt-12"><strong>II. Level Update Mechanism:</strong></p><p class="mt-4">⏰ Update Time: Every Sunday at 23:00 (UTC+8)</p><p class="mt-4">❄️ Smart Adjustment: Auto-downgrade if conditions not met</p>
          <p class="mt-12">✨ Stay Active · Steadily Upgrade · Enjoy Higher Returns!</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const tiers = [
  {grade:'V',assets:'50',friends:'0',unlock:'Robot Basic',limit:'5'},
  {grade:'V1',assets:'100',friends:'10',unlock:'Robot No.1',limit:'10'},
  {grade:'V2',assets:'200',friends:'20',unlock:'Robot No.2',limit:'20'},
  {grade:'V3',assets:'500',friends:'30',unlock:'Robot No.3',limit:'20'},
  {grade:'V4',assets:'1000',friends:'40',unlock:'Robot No.4',limit:'20'},
  {grade:'V5',assets:'5000',friends:'50',unlock:'Unlimited',limit:'20'},
  {grade:'V6',assets:'10000',friends:'100',unlock:'Unlimited',limit:'20'},
  {grade:'V7',assets:'15000',friends:'150',unlock:'Unlimited',limit:'20'},
  {grade:'V8',assets:'20000',friends:'200',unlock:'Unlimited',limit:'20'},
]
</script>
<style scoped>
.profile-card-upgrade{text-align:center;padding:24px;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid var(--border-light)}
.avatar-sm{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#FF6B9D,#C850C0);display:flex;align-items:center;justify-content:center;margin:0 auto}
</style>
