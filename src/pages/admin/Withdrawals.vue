<template>
  <div>
    <div class="toolbar">
      <div class="tab-filters"><button v-for="s in ['all','pending','approved','rejected']" :key="s" class="filter-btn" :class="{active:filter===s}" @click="filter=s;fetchWithdrawals()">{{ s }}</button></div>
    </div>

    <!-- Desktop Table -->
    <div class="table-wrap desktop-only">
      <table class="admin-table">
        <thead><tr><th>User</th><th>Coin</th><th>Amount</th><th>Fee</th><th>Address</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="w in withdrawals" :key="w.id">
            <td class="fw-500">{{ w.user?.email || '—' }}</td>
            <td>{{ w.coin }}</td>
            <td class="fw-600">{{ w.amount }}</td><td class="fs-12">{{ w.fee }}</td>
            <td class="fs-11 mono addr-cell">{{ w.address }}</td>
            <td><span class="badge-sm" :class="w.status">{{ w.status }}</span></td>
            <td class="fs-12 text-muted">{{ new Date(w.createdAt).toLocaleString() }}</td>
            <td v-if="w.status==='pending'" class="action-btns">
              <button class="action-btn approve" @click="review(w.id,'approved')">✓</button>
              <button class="action-btn reject" @click="review(w.id,'rejected')">✕</button>
            </td>
            <td v-else class="fs-12 text-muted">{{ w.txHash?.slice(0,12) || w.reviewNote || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="mobile-only">
      <div v-for="w in withdrawals" :key="w.id" class="m-card">
        <div class="m-card-top">
          <div><div class="fw-500 fs-14">{{ w.user?.email || '—' }}</div><div class="fs-11 text-muted">{{ new Date(w.createdAt).toLocaleString() }}</div></div>
          <span class="badge-sm" :class="w.status">{{ w.status }}</span>
        </div>
        <div class="m-card-row"><span class="text-muted">Amount</span><span class="fw-600">{{ w.amount }} {{ w.coin }}</span></div>
        <div class="m-card-row"><span class="text-muted">Fee</span><span>{{ w.fee }} {{ w.coin }}</span></div>
        <div class="m-card-row"><span class="text-muted">Network</span><span>{{ w.network }}</span></div>
        <div class="m-card-row addr"><span class="text-muted">Address</span><span class="mono fs-11 addr-text">{{ w.address }}</span></div>
        <div v-if="w.status==='pending'" class="m-card-actions">
          <button class="action-btn approve" @click="review(w.id,'approved')">✓ Approve</button>
          <button class="action-btn reject" @click="review(w.id,'rejected')">✕ Reject</button>
        </div>
      </div>
    </div>

    <div v-if="withdrawals.length===0" class="empty-state-admin">No {{ filter }} withdrawals</div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import API_BASE_URL from '../../config/api.js'
const API = `${API_BASE_URL}/api`
const token = localStorage.getItem('nt_admin_token')
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

const withdrawals = ref([])
const filter = ref('all')

const fetchWithdrawals = async () => {
  const status = filter.value === 'all' ? '' : `&status=${filter.value}`
  const res = await fetch(`${API}/admin/withdrawals?limit=50${status}`, { headers }).then(r => r.json())
  if (res.success) withdrawals.value = res.data.withdrawals || []
}

const review = async (id, status) => {
  const note = status === 'rejected' ? prompt('Rejection reason (optional):') : null
  const txHash = status === 'approved' ? prompt('Transaction hash (optional):') : null
  await fetch(`${API}/admin/withdrawals/${id}`, { method: 'PUT', headers, body: JSON.stringify({ status, note, txHash }) })
  fetchWithdrawals()
}

onMounted(fetchWithdrawals)
</script>
<style scoped>
.toolbar{margin-bottom:16px}
.tab-filters{display:flex;gap:4px;background:white;border-radius:8px;padding:4px;border:1px solid #E8ECF2;flex-wrap:wrap}
.filter-btn{padding:6px 16px;border:none;border-radius:6px;background:transparent;font-size:13px;font-weight:500;cursor:pointer;text-transform:capitalize;color:#6B7280}
.filter-btn.active{background:#1A6CFF;color:white}
.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
.admin-table{width:100%;border-collapse:separate;border-spacing:0;background:white;border-radius:12px;border:1px solid #E8ECF2;overflow:hidden;min-width:700px}
.admin-table th{text-align:left;padding:12px 14px;font-size:12px;font-weight:600;color:#6B7280;background:#F4F6FA;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
.admin-table td{padding:12px 14px;border-top:1px solid #F4F6FA;font-size:13px}
.addr-cell{max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.badge-sm{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500}
.badge-sm.pending{background:#FFF8ED;color:#FFB84D}.badge-sm.approved{background:#E6F9F1;color:#00C087}.badge-sm.rejected{background:#FFF1F3;color:#FF4D6A}
.action-btns{display:flex;gap:6px}
.action-btn{padding:6px 12px;border-radius:6px;border:none;font-size:12px;cursor:pointer;font-weight:500}
.action-btn.approve{background:#E6F9F1;color:#00C087}.action-btn.approve:hover{background:#00C087;color:white}
.action-btn.reject{background:#FFF1F3;color:#FF4D6A}.action-btn.reject:hover{background:#FF4D6A;color:white}
.empty-state-admin{text-align:center;padding:48px;color:#9CA3AF;font-size:14px;background:white;border-radius:12px;margin-top:16px}
.fw-500{font-weight:500}.fw-600{font-weight:600}.fs-11{font-size:11px}.fs-12{font-size:12px}.fs-14{font-size:14px}.text-muted{color:#9CA3AF}.mono{font-family:monospace}

.mobile-only{display:none}.desktop-only{display:block}
.m-card{background:white;border-radius:12px;border:1px solid #E8ECF2;padding:14px;margin-bottom:10px}
.m-card-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:8px}
.m-card-row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px solid #F4F6FA}
.m-card-row:last-of-type{border:none}
.m-card-row.addr{flex-direction:column;gap:4px}
.addr-text{word-break:break-all}
.m-card-actions{display:flex;gap:8px;margin-top:12px}
.m-card-actions .action-btn{flex:1;padding:8px;text-align:center}

@media(max-width:768px){
  .desktop-only{display:none}
  .mobile-only{display:block}
  .filter-btn{padding:5px 12px;font-size:12px}
}
</style>
