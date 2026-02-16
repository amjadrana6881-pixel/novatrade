<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Loan</span><button class="page-header__action"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></button></div>
    <div class="page-content">
      <div class="card"><div class="text-center"><div class="fs-12 text-muted">Loan Credit</div><div class="flex items-center justify-center gap-8 mt-4"><input v-model="creditAmount" type="number" class="loan-input" placeholder="0"/><span class="fs-14 fw-600">USDT</span></div></div>
        <button class="btn btn-primary mt-16">Apply</button>
      </div>
      <table class="data-table mt-16"><thead><tr><th>User Grade</th><th>Assets</th><th>Friends</th><th>Credit</th><th>Cycle</th></tr></thead>
        <tbody><tr v-for="t in tiers" :key="t.grade"><td class="fw-600">{{t.grade}}</td><td>{{t.assets}}</td><td>{{t.friends}}</td><td>{{t.credit}}</td><td>{{t.cycle}}</td></tr></tbody></table>
      <div class="card mt-16"><h4 class="fs-14 fw-600 mb-8">🏦 Loan-Specific Robot</h4>
        <div class="detail-row"><span>🎯 Applicable Levels</span><span>V1-V4 Users</span></div>
        <div class="detail-row"><span>🪙 Application Limit</span><span>1 per level</span></div>
        <div class="detail-row"><span>🏠 Purpose of Funds</span><span>Robot transactions only</span></div>
        <div class="detail-row"><span>💳 Loan Disbursement</span><span>Auto-invested in robot</span></div>
        <div class="detail-row"><span>📈 Earnings</span><span class="text-green fw-600">2.5% daily return</span></div>
        <div class="detail-row"><span>📅 Loan Period</span><span>10 days</span></div>
        <div class="detail-row"><span>✅ Repayment</span><span>Auto upon maturity</span></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const creditAmount = ref('')
const tiers = [
  {grade:'V1',assets:'100',friends:'10',credit:'1000',cycle:'10'},
  {grade:'V2',assets:'200',friends:'20',credit:'2000',cycle:'10'},
  {grade:'V3',assets:'500',friends:'30',credit:'3000',cycle:'10'},
  {grade:'V4',assets:'1000',friends:'40',credit:'4000',cycle:'10'},
]
</script>
<style scoped>
.loan-input{border:none;border-bottom:2px solid var(--border);font-size:28px;font-weight:700;text-align:center;width:120px;outline:none;background:transparent;font-family:var(--font-heading)}
.loan-input:focus{border-bottom-color:var(--primary)}
.detail-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-light);font-size:13px}
</style>
