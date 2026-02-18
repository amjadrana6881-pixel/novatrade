<template>
  <div class="page">
    <div class="page-header">
      <button class="page-header__back" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <span class="page-header__title">Invite Friends</span>
      <span style="width:32px"></span>
    </div>

    <!-- Invite Banner -->
    <div class="invite-banner">
      <div class="invite-code-label">Your Invitation Code</div>
      <div class="invite-code">{{ inviteCode }}</div>
      <button class="btn btn-invite" @click="copyLink">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        Copy Invitation Link
      </button>
    </div>

    <div class="page-content">
      <!-- Team Stats -->
      <div class="stats-card">
        <div class="stat-item">
          <span class="stat-label">Level 1</span>
          <span class="stat-value">{{ stats.l1 }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-label">Level 2</span>
          <span class="stat-value">{{ stats.l2 }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-label">Level 3</span>
          <span class="stat-value">{{ stats.l3 }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-label">Team Balance</span>
          <span class="stat-value green">${{ stats.teamBalance.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Referral List Tabs -->
      <div class="tab-row mt-16">
        <button v-for="lv in [1,2,3]" :key="lv" class="tab-btn" :class="{active: activeTab===lv}" @click="activeTab=lv">Level {{ lv }} ({{ lv===1?stats.l1:lv===2?stats.l2:stats.l3 }})</button>
      </div>

      <!-- Referral Users List -->
      <div class="referral-list mt-12">
        <div v-if="currentList.length === 0" class="empty-ref">No Level {{ activeTab }} referrals yet</div>
        <div v-for="u in currentList" :key="u.id" class="ref-item">
          <div class="ref-avatar">{{ u.email.charAt(0).toUpperCase() }}</div>
          <div class="ref-info">
            <div class="ref-email">{{ maskEmail(u.email) }}</div>
            <div class="ref-meta">VIP: {{ u.vipLevel }} · Joined {{ new Date(u.createdAt).toLocaleDateString() }}</div>
          </div>
          <div class="ref-balance">
            <div class="ref-balance-val">${{ (u.usdtBalance || 0).toFixed(2) }}</div>
            <div class="ref-balance-label">Balance</div>
          </div>
        </div>
      </div>

      <!-- Commission Rates -->
      <div class="card mt-16">
        <h4 class="fs-14 fw-600 mb-8">Commission Rates</h4>
        <table class="data-table">
          <thead><tr><th>Level</th><th>Level 1</th><th>Level 2</th><th>Level 3</th></tr></thead>
          <tbody><tr v-for="r in rates" :key="r.level"><td class="fw-600">{{r.level}}</td><td>{{r.l1}}</td><td>{{r.l2}}</td><td>{{r.l3}}</td></tr></tbody>
        </table>
        <p class="fs-12 text-muted mt-8">All rebates are extracted from actual profits and do not affect your own earnings.</p>
      </div>
    </div>

    <!-- Copy Toast -->
    <div v-if="copied" class="copy-toast">✓ Link copied!</div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import API_BASE_URL from '../config/api.js'

const inviteCode = ref('')
const stats = ref({ l1: 0, l2: 0, l3: 0, l3: 0, teamBalance: 0 })
const referrals = ref({ level1: [], level2: [], level3: [] })
const rates = ref([])
const activeTab = ref(1)
const copied = ref(false)

const currentList = computed(() => {
  if (activeTab.value === 1) return referrals.value.level1
  if (activeTab.value === 2) return referrals.value.level2
  return referrals.value.level3
})

const maskEmail = (email) => {
  if (!email) return '***'
  const [user, domain] = email.split('@')
  if (!domain) return email
  const visible = user.length > 3 ? user.slice(0, 3) : user.slice(0, 1)
  const stars = '*'.repeat(Math.max(3, user.length - visible.length))
  return `${visible}${stars}@${domain}`
}

const fetchConfig = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/config/public`)
    const data = await res.json()
    if (data.success && data.data.referral_rates) {
      rates.value = data.data.referral_rates
    }
  } catch (err) {
    rates.value = [
      {level:'V-V4',l1:'10%',l2:'3%',l3:'1%'},
      {level:'V5',l1:'11%',l2:'4%',l3:'1%'},
      {level:'V6',l1:'12%',l2:'5%',l3:'1%'},
      {level:'V7',l1:'13%',l2:'6%',l3:'1%'},
      {level:'V8',l1:'14%',l2:'7%',l3:'1%'},
    ]
  }
}

const fetchReferrals = async () => {
  const token = localStorage.getItem('nt_token')
  if (!token) return
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/referrals`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.success) {
      inviteCode.value = data.data.inviteCode
      if (data.data.stats) stats.value = data.data.stats
      if (data.data.referrals) referrals.value = data.data.referrals
    }
  } catch (err) { console.error(err) }
}

const copyLink = () => {
  navigator.clipboard?.writeText(`https://novatrade-zeta.vercel.app/register?ref=${inviteCode.value}`)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

onMounted(() => {
  fetchConfig()
  fetchReferrals()
})
</script>
<style scoped>
.invite-banner{margin:16px;padding:28px 24px;background:linear-gradient(135deg,#1A3A8A,#1A6CFF);border-radius:var(--radius-lg);text-align:center}
.invite-code-label{font-size:12px;color:rgba(255,255,255,0.7);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px}
.invite-code{font-size:32px;font-family:var(--font-heading);font-weight:800;color:#00C087;margin-bottom:16px;letter-spacing:4px}
.btn-invite{background:rgba(255,255,255,0.15);color:white;border-radius:var(--radius-md);padding:12px 20px;width:100%;font-weight:600;font-size:14px;border:1px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;cursor:pointer}
.btn-invite:active{background:rgba(255,255,255,0.25)}

.stats-card{display:flex;background:var(--bg-card);padding:16px;border-radius:var(--radius-lg);border:1px solid var(--border-light)}
.stat-item{display:flex;flex-direction:column;align-items:center;flex:1}
.stat-label{font-size:11px;color:var(--text-muted);margin-bottom:4px}
.stat-value{font-size:18px;font-weight:700;color:var(--text-primary)}
.stat-value.green{color:#00C087}
.stat-divider{width:1px;background:var(--border-light);margin:4px 0}

.tab-row{display:flex;gap:6px;background:var(--bg-card);border-radius:var(--radius-md);padding:4px;border:1px solid var(--border-light)}
.tab-btn{flex:1;padding:8px 4px;border:none;border-radius:var(--radius-sm);background:transparent;font-size:12px;font-weight:500;cursor:pointer;color:var(--text-muted)}
.tab-btn.active{background:var(--primary);color:white}

.referral-list{display:flex;flex-direction:column;gap:8px}
.empty-ref{text-align:center;padding:32px;color:var(--text-muted);font-size:13px;background:var(--bg-card);border-radius:var(--radius-md);border:1px solid var(--border-light)}
.ref-item{display:flex;align-items:center;gap:12px;background:var(--bg-card);padding:12px 14px;border-radius:var(--radius-md);border:1px solid var(--border-light)}
.ref-avatar{width:36px;height:36px;min-width:36px;border-radius:50%;background:linear-gradient(135deg,#1A3A8A,#1A6CFF);color:white;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center}
.ref-info{flex:1;min-width:0}
.ref-email{font-size:13px;font-weight:500;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ref-meta{font-size:11px;color:var(--text-muted);margin-top:2px}
.ref-balance{text-align:right}
.ref-balance-val{font-size:14px;font-weight:700;color:#00C087}
.ref-balance-label{font-size:10px;color:var(--text-muted)}

.copy-toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1A1D26;color:white;padding:10px 20px;border-radius:20px;font-size:13px;z-index:999;animation:fadeIn .2s ease}
@keyframes fadeIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
</style>
