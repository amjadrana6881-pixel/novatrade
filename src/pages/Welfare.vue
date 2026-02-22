<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Welfare</span><span style="width:32px"></span></div>
    <div class="page-content">
      <table class="data-table"><thead><tr><th colspan="3" style="text-align:center;font-size:14px;font-weight:600;color:var(--text-primary)">NT Token Reward Rules</th></tr><tr><th>Plan</th><th>First subscription</th><th>Repeat subscription</th></tr></thead>
        <tbody><tr v-for="r in rewards" :key="r.model"><td class="fw-500">{{r.model}}</td><td>{{r.first}}</td><td>{{r.repeat}}</td></tr></tbody></table>
      <div class="bonus-table mt-12"><div class="bonus-row"><span>Real-name registration</span><span class="fw-600">1000 NT</span></div><div class="bonus-row"><span>Friend first subscribes to plan</span><span class="fw-600">3000 NT</span></div></div>
      <div class="card mt-16"><h4 class="fs-14 fw-600 mb-8">NT Current Value:</h4>
        <p class="fs-13">1 NT = 0.001 USDT</p><p class="fs-13">1000 NT = 1 USDT</p><p class="fs-13 mt-4">Minimum Exchange Amount: 10 USDT</p><p class="fs-12 text-muted mt-4">10 USDT = 10000 NT</p>
      </div>
      <div class="card mt-12"><h4 class="fs-14 fw-600 mb-8">📌 NT Future Value Explanation</h4>
        <p class="fs-13 text-secondary">NT is the platform's core token, used not only for trading and incentives but also as a value bridge connecting users and the platform's future development.</p>
        <p class="mt-8 fs-13"><strong>Key Highlights:</strong></p>
        <p class="fs-13 text-secondary mt-4">🔹 Value Carrier: Holding NT grants exclusive platform benefits and priority access to activities; scarcity and issuance rules determine long-term potential.</p>
      </div>
    </div>
  </div>
</template>
<script setup>
const rewards = [
  {model:'Starter',first:'5000 NT',repeat:'500 NT'},
  {model:'Silver',first:'10000 NT',repeat:'1000 NT'},
  {model:'Gold',first:'20000 NT',repeat:'2000 NT'},
  {model:'Platinum',first:'50000 NT',repeat:'5000 NT'},
  {model:'Diamond',first:'100000 NT',repeat:'10000 NT'},
]
</script>
<style scoped>
.bonus-table{background:var(--bg-card);border-radius:var(--radius-md);border:1px solid var(--border-light);overflow:hidden}
.bonus-row{display:flex;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border-light);font-size:13px}
.bonus-row:last-child{border:none}
</style>
