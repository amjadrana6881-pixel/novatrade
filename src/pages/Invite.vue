<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Invite Friends</span><span style="width:32px"></span></div>
    <div class="invite-banner">
      <div class="invite-code">{{ inviteCode }}</div>
      <button class="btn btn-invite" @click="copyLink">Copy invitation link</button>
      <button class="btn btn-invite" @click="genPoster">Generate My Poster</button>
    </div>
    <div class="page-content">
      <!-- Team Stats -->
      <div class="stats-card">
        <div class="stat-item">
          <span class="stat-label">Team Size</span>
          <span class="stat-value">{{ (stats.l1 + stats.l2 + stats.l3) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Team Balance</span>
          <span class="stat-value">${{ stats.teamBalance.toFixed(2) }}</span>
        </div>
      </div>

      <table class="data-table mt-16"><thead><tr><th>Level</th><th>Level 1</th><th>Level 2</th><th>Level 3</th></tr></thead>
        <tbody><tr v-for="r in rates" :key="r.level"><td class="fw-600">{{r.level}}</td><td>{{r.l1}}</td><td>{{r.l2}}</td><td>{{r.l3}}</td></tr></tbody></table>
      <div class="card mt-16"><p class="fs-13 text-secondary">Our platform focuses on assisting users in achieving automated operations and intelligent profit generation through smart robots. Based on actual profits by users you invite, the platform will continuously rebate you:</p>
        <p class="mt-8 fs-13">When A's robot generates profit, you receive a <strong>10%</strong> rebate.</p>
        <p class="mt-4 fs-13">When B's robot generates profit, you receive a <strong>3%</strong> rebate.</p>
        <p class="mt-4 fs-13">When C's robot generates profit, you receive a <strong>1%</strong> rebate.</p>
        <p class="mt-8 fs-12 text-muted">All rebates are extracted from actual profits and do not affect your own earnings.</p>
      </div>
      <button class="btn btn-primary mt-16">Confirm</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

const inviteCode = ref('')
const stats = ref({ l1: 0, l2: 0, l3: 0, teamBalance: 0 })
const rates = [
  {level:'V-V4',l1:'10%',l2:'3%',l3:'1%'},
  {level:'V5',l1:'11%',l2:'4%',l3:'1%'},
  {level:'V6',l1:'12%',l2:'5%',l3:'1%'},
  {level:'V7',l1:'13%',l2:'6%',l3:'1%'},
  {level:'V8',l1:'14%',l2:'7%',l3:'1%'},
]

const fetchReferrals = async () => {
  const token = localStorage.getItem('nt_token')
  if (!token) return

  try {
    const res = await fetch('http://localhost:3001/api/user/referrals', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.success) {
      inviteCode.value = data.data.inviteCode
      if (data.data.stats) {
        stats.value = data.data.stats
      }
    }
  } catch (err) {
    console.error(err)
  }
}

const copyLink = () => { navigator.clipboard?.writeText(`https://novatrade-zeta.vercel.app/register?ref=${inviteCode.value}`) }
const genPoster = () => { alert('Poster generation coming soon!') }

onMounted(fetchReferrals)
</script>
<style scoped>
.invite-banner{margin:16px;padding:24px;background:linear-gradient(135deg,#1A3A8A,#1A6CFF);border-radius:var(--radius-lg);text-align:center}
.invite-code{font-size:28px;font-family:var(--font-heading);font-weight:800;color:#00C087;margin-bottom:16px}
.btn-invite{background:rgba(0,192,135,0.9);color:white;margin-bottom:8px;border-radius:var(--radius-md);padding:12px;width:100%;font-weight:600;font-size:14px}

.stats-card {
  display: flex;
  justify-content: space-between;
  background: var(--bg-card);
  padding: 16px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
}
.stat-item { display: flex; flex-direction: column; align-items: center; flex: 1; }
.stat-label { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
.stat-value { font-size: 18px; font-weight: 700; color: var(--text-primary); }
</style>
