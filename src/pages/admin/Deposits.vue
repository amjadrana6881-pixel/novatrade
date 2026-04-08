<template>
  <div>
    <div class="toolbar">
      <div class="tab-filters"><button v-for="s in ['all','pending','approved','rejected']" :key="s" class="filter-btn" :class="{active:filter===s}" @click="filter=s;fetchDeposits()">{{ s }}</button></div>
    </div>

    <!-- Desktop Table -->
    <div class="table-wrap desktop-only">
      <table class="admin-table">
        <thead><tr><th>User</th><th>Coin/Net</th><th>Amount</th><th>TXID</th><th>Proof</th><th>Referred By</th><th>Total Dep.</th><th>Total Wit.</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="d in deposits" :key="d.id" class="clickable-row" @click="openDetail(d)">
            <td>
              <div class="fw-500">{{ d.user?.email || '—' }}</div>
              <div class="fs-11 text-muted">{{ d.user?.nickname || '' }} · {{ d.user?.vipLevel || '' }}</div>
            </td>
            <td class="fs-12">{{ d.coin }}<br/><span class="text-muted">{{ d.network }}</span></td>
            <td class="fw-600">{{ d.amount }}</td>
            <td class="fs-11 font-mono">{{ d.txHash || '—' }}</td>
            <td>
              <button v-if="d.proof" class="btn-text" @click.stop="selectedProof = d.proof">View Proof</button>
              <span v-else class="text-muted">—</span>
            </td>
            <td class="fs-12">{{ d.referrer?.email || '—' }}</td>
            <td class="fs-12 fw-500" style="color:#00C087">${{ (d.totalDeposited || 0).toLocaleString() }}</td>
            <td class="fs-12 fw-500" style="color:#FF6B9D">${{ (d.totalWithdrawn || 0).toLocaleString() }}</td>
            <td><span class="badge-sm" :class="d.status">{{ d.status }}</span></td>
            <td class="fs-11 text-muted">{{ new Date(d.createdAt).toLocaleString() }}</td>
            <td v-if="d.status==='pending'" class="action-btns" @click.stop>
              <button class="action-btn approve" @click="review(d.id,'approved')">Approve</button>
              <button class="action-btn reject" @click="review(d.id,'rejected')">Reject</button>
            </td>
            <td v-else class="fs-12 text-muted">{{ d.reviewNote || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="mobile-only">
      <div v-for="d in deposits" :key="d.id" class="m-card" @click="openDetail(d)">
        <div class="m-card-top">
          <div>
            <div class="fw-500 fs-14">{{ d.user?.email || '—' }}</div>
            <div class="fs-11 text-muted">{{ d.user?.nickname || '' }} · {{ d.user?.vipLevel || '' }}</div>
            <div class="fs-11 text-muted">{{ new Date(d.createdAt).toLocaleString() }}</div>
          </div>
          <span class="badge-sm" :class="d.status">{{ d.status }}</span>
        </div>
        <div class="m-card-row"><span class="text-muted">Amount</span><span class="fw-500">{{ d.amount }} {{ d.coin }}</span></div>
        <div class="m-card-row"><span class="text-muted">Network</span><span>{{ d.network }}</span></div>
        <div class="m-card-row"><span class="text-muted">TXID</span><span class="fs-11 font-mono">{{ d.txHash || '—' }}</span></div>
        <div class="m-card-row"><span class="text-muted">Referred By</span><span>{{ d.referrer?.email || '—' }}</span></div>
        <div class="m-card-row"><span class="text-muted">Total Deposited</span><span class="fw-500" style="color:#00C087">${{ (d.totalDeposited || 0).toLocaleString() }}</span></div>
        <div class="m-card-row"><span class="text-muted">Total Withdrawn</span><span class="fw-500" style="color:#FF6B9D">${{ (d.totalWithdrawn || 0).toLocaleString() }}</span></div>
        <div v-if="d.proof" class="m-card-row" @click.stop>
          <span class="text-muted">Proof</span>
          <button class="btn-text" @click="selectedProof = d.proof">View Screenshot</button>
        </div>
        <div v-if="d.status==='pending'" class="m-card-actions" @click.stop>
          <button class="action-btn approve" @click="review(d.id,'approved')">Approve</button>
          <button class="action-btn reject" @click="review(d.id,'rejected')">Reject</button>
        </div>
      </div>
    </div>

    <!-- Proof Modal -->
    <div v-if="selectedProof" class="proof-modal" @click="selectedProof = null">
      <div class="proof-modal-content" @click.stop>
        <div class="modal-header">
          <span class="fw-600">Payment Proof</span>
          <button class="close-btn" @click="selectedProof = null">✕</button>
        </div>
        <div class="modal-body">
          <img :src="selectedProof" class="full-proof" />
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="detailItem" class="detail-overlay" @click="detailItem=null">
      <div class="detail-modal" @click.stop>
        <div class="detail-header">
          <span class="fw-600 fs-16">Deposit Details</span>
          <button class="close-btn" @click="detailItem=null">✕</button>
        </div>
        <div class="detail-body">
          <div class="detail-section">
            <div class="detail-section-title">User Information</div>
            <div class="detail-row"><span>Email</span><span class="fw-500">{{ detailItem.user?.email || '—' }}</span></div>
            <div class="detail-row"><span>Nickname</span><span>{{ detailItem.user?.nickname || '—' }}</span></div>
            <div class="detail-row"><span>VIP Level</span><span class="badge-sm" style="background:#E8F0FF;color:#1A6CFF">{{ detailItem.user?.vipLevel || '—' }}</span></div>
            <div class="detail-row"><span>KYC Status</span><span class="badge-sm" :class="detailItem.user?.kycStatus || ''">{{ detailItem.user?.kycStatus || '—' }}</span></div>
            <div class="detail-row"><span>Invite Code</span><span class="mono">{{ detailItem.user?.inviteCode || '—' }}</span></div>
            <div class="detail-row"><span>Joined</span><span>{{ detailItem.user?.createdAt ? new Date(detailItem.user.createdAt).toLocaleDateString() : '—' }}</span></div>
          </div>
          <div class="detail-section">
            <div class="detail-section-title">Referred By</div>
            <div v-if="detailItem.referrer" class="detail-row"><span>Referrer Email</span><span class="fw-500">{{ detailItem.referrer.email }}</span></div>
            <div v-if="detailItem.referrer" class="detail-row"><span>Referrer Name</span><span>{{ detailItem.referrer.nickname || '—' }}</span></div>
            <div v-if="!detailItem.referrer" class="detail-empty">No referrer (direct signup)</div>
          </div>
          <div class="detail-section">
            <div class="detail-section-title">Financial Summary</div>
            <div class="detail-row"><span>Total Deposited</span><span class="fw-600" style="color:#00C087">${{ (detailItem.totalDeposited || 0).toLocaleString() }}</span></div>
            <div class="detail-row"><span>Total Withdrawn</span><span class="fw-600" style="color:#FF6B9D">${{ (detailItem.totalWithdrawn || 0).toLocaleString() }}</span></div>
          </div>
          <div class="detail-section">
            <div class="detail-section-title">Deposit Request</div>
            <div class="detail-row"><span>Coin</span><span class="fw-500">{{ detailItem.coin }}</span></div>
            <div class="detail-row"><span>Network</span><span>{{ detailItem.network }}</span></div>
            <div class="detail-row"><span>Amount</span><span class="fw-600">{{ detailItem.amount }} {{ detailItem.coin }}</span></div>
            <div v-if="detailItem.txHash" class="detail-row"><span>TX Hash</span><span class="mono fs-12">{{ detailItem.txHash }}</span></div>
            <div class="detail-row"><span>Status</span><span class="badge-sm" :class="detailItem.status">{{ detailItem.status }}</span></div>
            <div class="detail-row"><span>Requested</span><span>{{ new Date(detailItem.createdAt).toLocaleString() }}</span></div>
            <div v-if="detailItem.reviewNote" class="detail-row"><span>Note</span><span>{{ detailItem.reviewNote }}</span></div>
          </div>
          <div v-if="detailItem.proof" class="detail-section">
            <div class="detail-section-title">Payment Proof</div>
            <img :src="detailItem.proof" class="detail-proof-img" @click="selectedProof=detailItem.proof" />
          </div>
          <div v-if="detailItem.status==='pending'" class="detail-actions">
            <button class="action-btn approve full" @click="review(detailItem.id,'approved');detailItem=null">✓ Approve Deposit</button>
            <button class="action-btn reject full" @click="review(detailItem.id,'rejected');detailItem=null">✕ Reject Deposit</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="deposits.length===0" class="empty-state-admin">No {{ filter }} deposits</div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import API_BASE_URL from '../../config/api.js'
const API = `${API_BASE_URL}/api`
const token = localStorage.getItem('nt_admin_token')
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

const deposits = ref([])
const filter = ref('all')
const selectedProof = ref(null)
const detailItem = ref(null)

const fetchDeposits = async () => {
  const status = filter.value === 'all' ? '' : `&status=${filter.value}`
  const res = await fetch(`${API}/admin/deposits?limit=50${status}`, { headers }).then(r => r.json())
  if (res.success) deposits.value = res.data.deposits || []
}

const review = async (id, status) => {
  const note = status === 'rejected' ? prompt('Rejection reason (optional):') : null
  await fetch(`${API}/admin/deposits/${id}`, { method: 'PUT', headers, body: JSON.stringify({ status, note }) })
  fetchDeposits()
}

const openDetail = (d) => {
  detailItem.value = d
}

onMounted(fetchDeposits)
</script>
<style scoped>
.toolbar{margin-bottom:16px}
.tab-filters{display:flex;gap:4px;background:white;border-radius:8px;padding:4px;border:1px solid #E8ECF2;flex-wrap:wrap}
.filter-btn{padding:6px 16px;border:none;border-radius:6px;background:transparent;font-size:13px;font-weight:500;cursor:pointer;text-transform:capitalize;color:#6B7280}
.filter-btn.active{background:#1A6CFF;color:white}
.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
.admin-table{width:100%;border-collapse:separate;border-spacing:0;background:white;border-radius:12px;border:1px solid #E8ECF2;overflow:hidden;min-width:900px}
.admin-table th{text-align:left;padding:12px 14px;font-size:11px;font-weight:600;color:#6B7280;background:#F4F6FA;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
.admin-table td{padding:12px 14px;border-top:1px solid #F4F6FA;font-size:13px}
.clickable-row{cursor:pointer;transition:background 0.15s}.clickable-row:hover{background:#F9FAFB}
.badge-sm{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500}
.badge-sm.pending{background:#FFF8ED;color:#FFB84D}.badge-sm.approved{background:#E6F9F1;color:#00C087}.badge-sm.rejected{background:#FFF1F3;color:#FF4D6A}
.badge-sm.none{background:#F4F6FA;color:#6B7280}
.action-btns{display:flex;gap:6px}
.action-btn{padding:6px 12px;border-radius:6px;border:none;font-size:12px;cursor:pointer;font-weight:500}
.action-btn.approve{background:#E6F9F1;color:#00C087}.action-btn.approve:hover{background:#00C087;color:white}
.action-btn.reject{background:#FFF1F3;color:#FF4D6A}.action-btn.reject:hover{background:#FF4D6A;color:white}
.action-btn.full{flex:1;padding:10px;text-align:center;font-size:13px}
.empty-state-admin{text-align:center;padding:48px;color:#9CA3AF;font-size:14px;background:white;border-radius:12px;margin-top:16px}
.fw-500{font-weight:500}.fw-600{font-weight:600}.fs-11{font-size:11px}.fs-12{font-size:12px}.fs-14{font-size:14px}.fs-16{font-size:16px}.text-muted{color:#9CA3AF}.font-mono{font-family:monospace}.mono{font-family:monospace}
.btn-text{background:none;border:none;color:#1A6CFF;font-size:12px;font-weight:500;cursor:pointer;padding:0;text-decoration:underline}

.proof-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:1001;padding:20px}
.proof-modal-content{background:white;border-radius:12px;width:100%;max-width:500px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden}
.modal-header{padding:12px 16px;border-bottom:1px solid #F4F6FA;display:flex;justify-content:space-between;align-items:center;font-size:14px}
.close-btn{background:none;border:none;font-size:18px;cursor:pointer;color:#6B7280;padding:4px}
.modal-body{padding:16px;overflow-y:auto;text-align:center;background:#F9FAFB}
.full-proof{max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1)}

/* Detail Modal */
.detail-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
.detail-modal{background:white;border-radius:16px;width:100%;max-width:540px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.15)}
.detail-header{padding:16px 20px;border-bottom:1px solid #E8ECF2;display:flex;justify-content:space-between;align-items:center}
.detail-body{padding:20px;overflow-y:auto}
.detail-section{margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #F4F6FA}
.detail-section:last-child{border:none;margin-bottom:0}
.detail-section-title{font-size:13px;font-weight:600;color:#1A6CFF;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px}
.detail-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:13px;gap:12px}
.detail-row span:first-child{color:#6B7280;flex-shrink:0}
.detail-row span:last-child{text-align:right;word-break:break-all}
.detail-empty{color:#9CA3AF;font-size:13px;font-style:italic;padding:4px 0}
.detail-actions{display:flex;gap:10px;margin-top:8px}
.detail-proof-img{max-width:100%;border-radius:8px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.1)}

.mobile-only{display:none}.desktop-only{display:block}
.m-card{background:white;border-radius:12px;border:1px solid #E8ECF2;padding:14px;margin-bottom:10px;cursor:pointer;transition:box-shadow 0.15s}
.m-card:active{box-shadow:0 2px 12px rgba(0,0,0,0.08)}
.m-card-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:8px}
.m-card-row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px solid #F4F6FA}
.m-card-row:last-of-type{border:none}
.m-card-actions{display:flex;gap:8px;margin-top:12px}
.m-card-actions .action-btn{flex:1;padding:8px;text-align:center}

@media(max-width:768px){
  .desktop-only{display:none}
  .mobile-only{display:block}
  .filter-btn{padding:5px 12px;font-size:12px}
  .detail-modal{max-width:100%;margin:0;border-radius:16px 16px 0 0;max-height:85vh;align-self:flex-end}
  .detail-overlay{align-items:flex-end;padding:0}
}
</style>
