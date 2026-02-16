<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Welfare</span><span style="width:32px"></span></div>
    <div class="page-content">
      <table class="data-table"><thead><tr><th colspan="3" style="text-align:center;font-size:14px;font-weight:600;color:var(--text-primary)">LYP Token Reward Rules</th></tr><tr><th>Robot model</th><th>First purchase</th><th>Repeat purchase</th></tr></thead>
        <tbody><tr v-for="r in rewards" :key="r.model"><td class="fw-500">{{r.model}}</td><td>{{r.first}}</td><td>{{r.repeat}}</td></tr></tbody></table>
      <div class="bonus-table mt-12"><div class="bonus-row"><span>Real-name registration</span><span class="fw-600">1000 LYP</span></div><div class="bonus-row"><span>Friend first buys robot</span><span class="fw-600">3000 LYP</span></div></div>
      <div class="card mt-16"><h4 class="fs-14 fw-600 mb-8">LYP Current Value:</h4>
        <p class="fs-13">1 LYP = 0.001 USDT</p><p class="fs-13">1000 LYP = 1 USDT</p><p class="fs-13 mt-4">Minimum Exchange Amount: 10 USDT</p><p class="fs-12 text-muted mt-4">10 USDT = 10000 LYP</p>
      </div>
      <div class="card mt-12"><h4 class="fs-14 fw-600 mb-8">📌 LYP Future Value Explanation</h4>
        <p class="fs-13 text-secondary">LYP is the platform's core token, used not only for trading and incentives but also as a value bridge connecting users and the platform's future development.</p>
        <p class="mt-8 fs-13"><strong>Key Highlights:</strong></p>
        <p class="fs-13 text-secondary mt-4">🔹 Value Carrier: Holding LYP grants exclusive platform benefits and priority access to activities; scarcity and issuance rules determine long-term potential.</p>
      </div>
    </div>
  </div>
</template>
<script setup>
const rewards = [
  {model:'Basic',first:'5000 LYP',repeat:'500 LYP'},
  {model:'No.1',first:'10000 LYP',repeat:'1000 LYP'},
  {model:'No.2',first:'20000 LYP',repeat:'2000 LYP'},
  {model:'No.3',first:'50000 LYP',repeat:'5000 LYP'},
  {model:'No.4',first:'100000 LYP',repeat:'10000 LYP'},
]
</script>
<style scoped>
.bonus-table{background:var(--bg-card);border-radius:var(--radius-md);border:1px solid var(--border-light);overflow:hidden}
.bonus-row{display:flex;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border-light);font-size:13px}
.bonus-row:last-child{border:none}
</style>
