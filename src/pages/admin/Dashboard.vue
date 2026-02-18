<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card" :style="{borderLeft:`4px solid ${stat.color}`}">
        <div class="stat-icon" :style="{background:stat.bg}" v-html="stat.icon"></div>
        <div class="stat-info"><div class="stat-value">{{ stat.value }}</div><div class="stat-label">{{ stat.label }}</div></div>
      </div>
    </div>
    <div class="dashboard-grid">
      <div class="dash-card">
        <h3>Recent Deposits</h3>
        <div v-if="recentDeposits.length===0" class="empty-sm">No recent deposits</div>
        <div v-for="d in recentDeposits" :key="d.id" class="mini-row">
          <div class="mini-row-left"><span class="fw-500">{{ d.user?.email?.split('@')[0] || '—' }}</span><span class="badge-sm" :class="d.status">{{ d.status }}</span></div>
          <div class="mini-row-right"><span class="fw-600">{{ d.amount }} {{ d.coin }}</span><br/><span class="fs-11 text-muted">{{ new Date(d.createdAt).toLocaleDateString() }}</span></div>
        </div>
      </div>
      <div class="dash-card">
        <h3>Recent Withdrawals</h3>
        <div v-if="recentWithdrawals.length===0" class="empty-sm">No recent withdrawals</div>
        <div v-for="w in recentWithdrawals" :key="w.id" class="mini-row">
          <div class="mini-row-left"><span class="fw-500">{{ w.user?.email?.split('@')[0] || '—' }}</span><span class="badge-sm" :class="w.status">{{ w.status }}</span></div>
          <div class="mini-row-right"><span class="fw-600">{{ w.amount }} {{ w.coin }}</span><br/><span class="fs-11 text-muted">{{ new Date(w.createdAt).toLocaleDateString() }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import API_BASE_URL from '../../config/api.js'
const API = `${API_BASE_URL}/api`
const token = localStorage.getItem('nt_admin_token')
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

const stats = ref([])
const recentDeposits = ref([])
const recentWithdrawals = ref([])

onMounted(async () => {
  try {
    const [statsRes, depRes, witRes] = await Promise.all([
      fetch(`${API}/admin/stats`, { headers }).then(r => r.json()),
      fetch(`${API}/admin/deposits?limit=5`, { headers }).then(r => r.json()),
      fetch(`${API}/admin/withdrawals?limit=5`, { headers }).then(r => r.json()),
    ])

    if (statsRes.success) {
      const d = statsRes.data
      stats.value = [
        { label: 'Total Users', value: d.userCount, color: '#1A6CFF', bg: '#E8F0FF', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A6CFF" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
        { label: 'Total Deposited', value: `$${d.totalDeposited.toLocaleString()}`, color: '#00C087', bg: '#E6F9F1', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C087" stroke-width="2"><path d="M12 2v20M17 7l-5-5-5 5"/></svg>' },
        { label: 'Total Withdrawn', value: `$${d.totalWithdrawn.toLocaleString()}`, color: '#FF6B9D', bg: '#FFF1F5', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B9D" stroke-width="2"><path d="M12 22V2M17 17l-5 5-5-5"/></svg>' },
        { label: 'Pending Deposits', value: d.pendingDeposits, color: '#FFB84D', bg: '#FFF8ED', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFB84D" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
        { label: 'Pending Withdrawals', value: d.pendingWithdrawals, color: '#C850C0', bg: '#FAE8F9', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C850C0" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
        { label: 'Pending KYC', value: d.pendingKYC, color: '#7C3AED', bg: '#F3E8FF', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>' },
      ]
    }
    if (depRes.success) recentDeposits.value = depRes.data.deposits || []
    if (witRes.success) recentWithdrawals.value = witRes.data.withdrawals || []
  } catch (err) { console.error('Dashboard fetch error:', err) }
})
</script>
<style scoped>
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}
.stat-card{background:white;border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:14px;border:1px solid #E8ECF2}
.stat-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.stat-value{font-size:22px;font-weight:700;font-family:'Outfit',sans-serif;color:#1A1D26}
.stat-label{font-size:12px;color:#6B7280;margin-top:2px}
.dashboard-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.dash-card{background:white;border-radius:12px;padding:20px;border:1px solid #E8ECF2}
.dash-card h3{font-family:'Outfit',sans-serif;font-size:16px;font-weight:600;color:#1A1D26;margin-bottom:16px}
.mini-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #F4F6FA;gap:8px}
.mini-row:last-child{border:none}
.mini-row-left{display:flex;align-items:center;gap:6px;flex-wrap:wrap;min-width:0}
.mini-row-right{text-align:right;flex-shrink:0}
.badge-sm{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500}
.badge-sm.pending{background:#FFF8ED;color:#FFB84D}
.badge-sm.approved{background:#E6F9F1;color:#00C087}
.badge-sm.rejected{background:#FFF1F3;color:#FF4D6A}
.empty-sm{text-align:center;color:#9CA3AF;font-size:14px;padding:24px}
.fw-500{font-weight:500}.fw-600{font-weight:600}.fs-11{font-size:11px}.text-muted{color:#9CA3AF}

@media(max-width:1024px){.stats-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){
  .stats-grid{grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
  .stat-card{padding:12px 14px;gap:10px}
  .stat-value{font-size:18px}
  .stat-label{font-size:11px}
  .stat-icon{width:36px;height:36px}
  .dashboard-grid{grid-template-columns:1fr;gap:12px}
  .dash-card{padding:14px}
  .dash-card h3{font-size:14px;margin-bottom:12px}
}
@media(max-width:480px){
  .stats-grid{grid-template-columns:1fr;gap:8px}
  .stat-card{padding:10px 12px}
  .stat-value{font-size:16px}
}
</style>
