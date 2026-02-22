<template>
  <div>
    <div class="toolbar"><input v-model="search" class="search-input" placeholder="Search by email..." @input="fetchUsers"/><span class="result-count">{{ total }} users</span></div>
    
    <!-- Desktop Table -->
    <div class="table-wrap desktop-only">
      <table class="admin-table">
        <thead><tr><th>Email</th><th>VIP</th><th>KYC</th><th>Invite Code</th><th>Referred By</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" :class="{highlighted: detailUser?.id === u.id}">
            <td><div class="fw-500">{{ u.email }}</div><div class="fs-11 text-muted">{{ u.nickname || '—' }}</div></td>
            <td><select :value="u.vipLevel" @change="updateUser(u.id, {vipLevel: $event.target.value})" class="mini-select">
              <option v-for="v in ['V','V1','V2','V3','V4','V5','V6','V7','V8']" :key="v">{{v}}</option></select></td>
            <td><span class="badge-sm" :class="u.kycStatus">{{ u.kycStatus }}</span></td>
            <td class="fs-12 mono">{{ u.inviteCode }}</td>
            <td class="fs-12 mono">{{ u.invitedBy || '—' }}</td>
            <td><button class="toggle-btn" :class="{active:u.isActive}" @click="updateUser(u.id, {isActive:!u.isActive})">{{ u.isActive?'Active':'Blocked' }}</button></td>
            <td class="fs-12 text-muted">{{ new Date(u.createdAt).toLocaleDateString() }}</td>
            <td class="actions-col">
              <button class="action-btn" @click="showDetails(u)">📋 Details</button>
              <button class="action-btn" @click="openWallet(u)">💰 Wallet</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="mobile-only">
      <div v-for="u in users" :key="u.id" class="user-card-mobile">
        <div class="ucm-header">
          <div><div class="fw-500 fs-14">{{ u.email }}</div><div class="fs-11 text-muted">{{ u.nickname || '—' }} · {{ new Date(u.createdAt).toLocaleDateString() }}</div></div>
          <span class="badge-sm" :class="u.kycStatus">{{ u.kycStatus }}</span>
        </div>
        <div class="ucm-row">
          <div class="ucm-field"><label>VIP</label><select :value="u.vipLevel" @change="updateUser(u.id, {vipLevel: $event.target.value})" class="mini-select">
            <option v-for="v in ['V','V1','V2','V3','V4','V5','V6','V7','V8']" :key="v">{{v}}</option></select></div>
          <div class="ucm-field"><label>Code</label><span class="mono fs-12">{{ u.inviteCode }}</span></div>
          <div class="ucm-field"><label>Ref By</label><span class="mono fs-12">{{ u.invitedBy || '—' }}</span></div>
          <div class="ucm-field"><label>Status</label><button class="toggle-btn" :class="{active:u.isActive}" @click="updateUser(u.id, {isActive:!u.isActive})">{{ u.isActive?'Active':'Blocked' }}</button></div>
        </div>
        <div class="ucm-actions">
          <button class="action-btn" @click="showDetails(u)">📋 Details</button>
          <button class="action-btn" @click="openWallet(u)">💰 Wallet</button>
        </div>
      </div>
    </div>

    <div class="pagination"><button :disabled="page<=1" @click="page--;fetchUsers()">← Prev</button><span>{{ page }}/{{ pages }}</span><button :disabled="page>=pages" @click="page++;fetchUsers()">Next →</button></div>

    <!-- User Detail Panel -->
    <div v-if="detailUser" class="modal-overlay" @click.self="detailUser=null">
      <div class="detail-panel">
        <div class="detail-panel__header">
          <h3>{{ detailUser.email }}</h3>
          <button class="close-btn" @click="detailUser=null">✕</button>
        </div>

        <div v-if="detailLoading" class="detail-loading"><div class="spinner"></div> Loading details...</div>
        
        <div v-else class="detail-panel__body">
          <!-- User Summary -->
          <div class="detail-section">
            <h4>👤 User Info</h4>
            <div class="info-grid">
              <div class="info-item"><label>Email</label><span>{{ detail.user?.email }}</span></div>
              <div class="info-item"><label>Nickname</label><span>{{ detail.user?.nickname || '—' }}</span></div>
              <div class="info-item"><label>VIP Level</label><span class="badge-sm approved">{{ detail.user?.vipLevel }}</span></div>
              <div class="info-item"><label>KYC Status</label><span class="badge-sm" :class="detail.user?.kycStatus">{{ detail.user?.kycStatus }}</span></div>
              <div class="info-item"><label>KYC Name</label><span>{{ detail.user?.kycName || '—' }}</span></div>
              <div class="info-item"><label>Invite Code</label><span class="mono">{{ detail.user?.inviteCode }}</span></div>
              <div class="info-item"><label>Joined</label><span>{{ new Date(detail.user?.createdAt).toLocaleDateString() }}</span></div>
            </div>
          </div>

          <!-- Referrer -->
          <div class="detail-section">
            <h4>🔗 Referred By</h4>
            <div v-if="detail.referrer" class="ref-card">
              <span class="fw-500">{{ detail.referrer.email }}</span>
              <span class="badge-sm approved">{{ detail.referrer.vipLevel }}</span>
              <span class="mono fs-11">Code: {{ detail.referrer.inviteCode }}</span>
            </div>
            <div v-else class="empty-text">No referrer (direct signup)</div>
          </div>

          <!-- Downline -->
          <div class="detail-section">
            <h4>👥 Downline ({{ detail.downlineCount || 0 }})</h4>
            <div v-if="detail.downline?.length > 0" class="downline-list">
              <div v-for="d in detail.downline" :key="d.id" class="downline-row">
                <div><span class="fw-500 fs-13">{{ d.email }}</span></div>
                <div class="flex items-center gap-8">
                  <span class="badge-sm" :class="d.kycStatus">{{ d.kycStatus }}</span>
                  <span class="badge-sm approved">{{ d.vipLevel }}</span>
                  <span class="fs-11 text-muted">{{ new Date(d.createdAt).toLocaleDateString() }}</span>
                </div>
              </div>
            </div>
            <div v-else class="empty-text">No referrals yet</div>
          </div>

          <!-- Wallets -->
          <div class="detail-section">
            <h4>💰 Wallet Balances</h4>
            <div v-if="detail.wallets?.length > 0" class="wallet-grid">
              <div v-for="w in detail.wallets" :key="w.id" class="wallet-item">
                <div class="wallet-coin">{{ w.coin }}</div>
                <div class="wallet-vals">
                  <div>Available: <strong>{{ w.available?.toFixed(2) }}</strong></div>
                  <div class="text-muted fs-11">Frozen: {{ w.frozen?.toFixed(2) }}</div>
                  <div class="fs-11 text-muted">{{ w.account }}</div>
                </div>
              </div>
            </div>
            <div v-else class="empty-text">No wallets</div>
          </div>

          <!-- Deposits -->
          <div class="detail-section">
            <h4>📥 Deposits</h4>
            <div v-if="detail.deposits?.length > 0" class="txn-table-wrap">
              <table class="txn-table">
                <thead><tr><th>Amount</th><th>Coin</th><th>Network</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  <tr v-for="d in detail.deposits" :key="d.id">
                    <td class="fw-600">{{ d.amount }}</td>
                    <td>{{ d.coin }}</td>
                    <td class="fs-11">{{ d.network }}</td>
                    <td><span class="badge-sm" :class="d.status">{{ d.status }}</span></td>
                    <td class="fs-11 text-muted">{{ new Date(d.createdAt).toLocaleDateString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="empty-text">No deposits</div>
          </div>

          <!-- Withdrawals -->
          <div class="detail-section">
            <h4>📤 Withdrawals</h4>
            <div v-if="detail.withdrawals?.length > 0" class="txn-table-wrap">
              <table class="txn-table">
                <thead><tr><th>Amount</th><th>Coin</th><th>Address</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  <tr v-for="w in detail.withdrawals" :key="w.id">
                    <td class="fw-600">{{ w.amount }}</td>
                    <td>{{ w.coin }}</td>
                    <td class="fs-11 mono addr">{{ w.address }}</td>
                    <td><span class="badge-sm" :class="w.status">{{ w.status }}</span></td>
                    <td class="fs-11 text-muted">{{ new Date(w.createdAt).toLocaleDateString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="empty-text">No withdrawals</div>
          </div>

          <!-- Withdrawal Addresses -->
          <div class="detail-section">
            <h4>📍 Saved Withdrawal Addresses</h4>
            <div v-if="detail.withdrawAddresses?.length > 0">
              <div v-for="a in detail.withdrawAddresses" :key="a.id" class="addr-row">
                <div class="fw-500 fs-13">{{ a.label }} ({{ a.coin }} / {{ a.network }})</div>
                <div class="mono fs-11 text-muted addr">{{ a.address }}</div>
              </div>
            </div>
            <div v-else class="empty-text">No saved addresses</div>
          </div>

          <!-- Staking Plans -->
          <div class="detail-section">
            <h4>📈 Staking Plans</h4>
            <div v-if="detail.stakingPlans?.length > 0" class="txn-table-wrap">
              <table class="txn-table">
                <thead><tr><th>Plan</th><th>Amount</th><th>Earned</th><th>Status</th><th>Ends</th></tr></thead>
                <tbody>
                  <tr v-for="s in detail.stakingPlans" :key="s.id">
                    <td class="fw-500">{{ s.robot?.name || '—' }}</td>
                    <td>{{ s.amount }} USDT</td>
                    <td class="text-green fw-600">{{ s.earned }} USDT</td>
                    <td><span class="badge-sm" :class="s.status === 'running' ? 'approved' : s.status === 'completed' ? 'pending' : 'rejected'">{{ s.status === 'running' ? 'Active' : s.status }}</span></td>
                    <td class="fs-11 text-muted">{{ new Date(s.endDate).toLocaleDateString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="empty-text">No staking plans</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Wallet Modal -->
    <div v-if="walletUser" class="modal-overlay" @click.self="walletUser=null">
      <div class="modal-card">
        <h3>Wallet: {{ walletUser.email }}</h3>
        <div class="modal-form">
          <select v-model="walletForm.coin" class="mini-select"><option v-for="c in ['USDT','BTC','ETH','BNB','XRP','SOL','DOGE','ADA','DOT','AVAX']" :key="c">{{c}}</option></select>
          <input v-model="walletForm.amount" type="number" placeholder="Amount" class="mini-input"/>
          <select v-model="walletForm.action" class="mini-select"><option value="add">Add</option><option value="deduct">Deduct</option></select>
          <button class="action-btn success" @click="modifyWallet">Apply</button>
        </div>
        <div v-if="walletMsg" class="wallet-msg">{{ walletMsg }}</div>
        <button class="close-modal-btn" @click="walletUser=null">Close</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import API_BASE_URL from '../../config/api.js'
const API = `${API_BASE_URL}/api`
const token = localStorage.getItem('nt_admin_token')
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

const users = ref([])
const total = ref(0)
const pages = ref(1)
const page = ref(1)
const search = ref('')
const walletUser = ref(null)
const walletMsg = ref('')
const walletForm = reactive({ coin: 'USDT', amount: '', action: 'add' })
const detailUser = ref(null)
const detailLoading = ref(false)
const detail = ref({})

const fetchUsers = async () => {
  const res = await fetch(`${API}/admin/users?page=${page.value}&limit=15&search=${search.value}`, { headers }).then(r => r.json())
  if (res.success) { users.value = res.data.users; total.value = res.data.total; pages.value = res.data.pages }
}

const updateUser = async (id, data) => {
  await fetch(`${API}/admin/users/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) })
  fetchUsers()
}

const openWallet = (u) => { walletUser.value = u; walletMsg.value = '' }
const modifyWallet = async () => {
  if (!walletForm.amount) return
  const res = await fetch(`${API}/admin/users/${walletUser.value.id}/wallet`, { method: 'POST', headers, body: JSON.stringify(walletForm) }).then(r => r.json())
  walletMsg.value = res.message || res.error || 'Done'
}

const showDetails = async (u) => {
  detailUser.value = u
  detailLoading.value = true
  detail.value = {}
  try {
    const res = await fetch(`${API}/admin/users/${u.id}/details`, { headers }).then(r => r.json())
    if (res.success) detail.value = res.data
  } catch (err) {
    console.error(err)
  }
  detailLoading.value = false
}

onMounted(fetchUsers)
</script>
<style scoped>
.toolbar{display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap}
.search-input{padding:8px 14px;border:1px solid #E2E8F0;border-radius:8px;font-size:14px;width:260px;outline:none;max-width:100%;transition:border .15s}
.search-input:focus{border-color:#2563EB}
.result-count{font-size:13px;color:#64748B}
.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
.admin-table{width:100%;border-collapse:separate;border-spacing:0;background:white;border-radius:12px;border:1px solid #E2E8F0;overflow:hidden;min-width:800px}
.admin-table th{text-align:left;padding:12px 14px;font-size:12px;font-weight:600;color:#64748B;background:#F8FAFC;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
.admin-table td{padding:12px 14px;border-top:1px solid #F1F5F9;font-size:13px}
.admin-table tr.highlighted{background:#EEF2FF}
.mini-select{padding:4px 8px;border:1px solid #E2E8F0;border-radius:6px;font-size:12px;background:white;cursor:pointer}
.toggle-btn{padding:4px 10px;border-radius:4px;border:none;font-size:11px;font-weight:600;cursor:pointer;background:#FEF2F2;color:#EF4444}
.toggle-btn.active{background:#ECFDF5;color:#10B981}
.actions-col{display:flex;gap:6px}
.action-btn{padding:6px 12px;border-radius:6px;border:1px solid #E2E8F0;background:white;font-size:12px;cursor:pointer;white-space:nowrap;transition:all .15s}
.action-btn:hover{background:#F8FAFC;border-color:#CBD5E1}
.action-btn.success{background:#10B981;color:white;border:none}
.badge-sm{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500}
.badge-sm.none{background:#F8FAFC;color:#94A3B8}.badge-sm.pending{background:#FFFBEB;color:#F59E0B}.badge-sm.approved{background:#ECFDF5;color:#10B981}.badge-sm.rejected{background:#FEF2F2;color:#EF4444}
.pagination{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:16px;font-size:13px}
.pagination button{padding:6px 14px;border:1px solid #E2E8F0;border-radius:6px;background:white;cursor:pointer;font-size:12px}
.pagination button:disabled{opacity:.4;cursor:not-allowed}
.mono{font-family:monospace}
.fw-500{font-weight:500}.fw-600{font-weight:600}.fs-11{font-size:11px}.fs-12{font-size:12px}.fs-13{font-size:13px}.fs-14{font-size:14px}.text-muted{color:#94A3B8}.text-green{color:#10B981}
.flex{display:flex}.items-center{align-items:center}.gap-8{gap:8px}

/* Mobile card layout */
.mobile-only{display:none}
.desktop-only{display:block}
.user-card-mobile{background:white;border-radius:12px;border:1px solid #E2E8F0;padding:14px;margin-bottom:10px}
.ucm-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:8px}
.ucm-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:4px}
.ucm-field{display:flex;flex-direction:column;gap:4px}
.ucm-field label{font-size:10px;color:#94A3B8;text-transform:uppercase;letter-spacing:.5px}
.ucm-actions{display:flex;gap:8px;margin-top:10px}
.ucm-actions .action-btn{flex:1;text-align:center;padding:8px;font-size:13px}

/* Modal */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:999;padding:16px}
.modal-card{background:white;border-radius:12px;padding:24px;width:420px;max-width:100%}
.modal-card h3{font-size:16px;font-weight:600;margin-bottom:16px;word-break:break-all}
.modal-form{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.mini-input{padding:6px 10px;border:1px solid #E2E8F0;border-radius:6px;font-size:13px;width:100px}
.wallet-msg{margin-top:12px;padding:8px;background:#ECFDF5;color:#10B981;border-radius:6px;font-size:13px}
.close-modal-btn{margin-top:12px;padding:6px 16px;border:1px solid #E2E8F0;border-radius:6px;background:white;cursor:pointer;font-size:13px}

/* Detail Panel */
.detail-panel{background:white;border-radius:16px;width:720px;max-width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 50px rgba(0,0,0,.15)}
.detail-panel__header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #F1F5F9;position:sticky;top:0;background:white;z-index:10;border-radius:16px 16px 0 0}
.detail-panel__header h3{font-size:18px;font-weight:700;font-family:'Outfit',sans-serif;word-break:break-all}
.close-btn{width:32px;height:32px;border-radius:8px;border:1px solid #E2E8F0;background:white;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}
.close-btn:hover{background:#FEF2F2;border-color:#FCA5A5;color:#EF4444}
.detail-panel__body{padding:20px 24px}
.detail-loading{padding:48px;text-align:center;color:#64748B;display:flex;align-items:center;justify-content:center;gap:12px;font-size:14px}
.spinner{width:20px;height:20px;border:2px solid #E2E8F0;border-top-color:#2563EB;border-radius:50%;animation:spin .5s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

.detail-section{margin-bottom:24px}
.detail-section h4{font-size:14px;font-weight:600;color:#0F172A;margin-bottom:12px;font-family:'Outfit',sans-serif;display:flex;align-items:center;gap:6px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.info-item{display:flex;flex-direction:column;gap:2px;padding:8px 12px;background:#F8FAFC;border-radius:8px}
.info-item label{font-size:10px;color:#94A3B8;text-transform:uppercase;letter-spacing:.5px;font-weight:500}
.info-item span{font-size:13px;font-weight:500;color:#0F172A}
.ref-card{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#EEF2FF;border-radius:8px;font-size:13px;flex-wrap:wrap}
.empty-text{color:#94A3B8;font-size:13px;font-style:italic;padding:8px 0}

.downline-list{max-height:200px;overflow-y:auto;border:1px solid #F1F5F9;border-radius:8px}
.downline-row{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid #F1F5F9;gap:8px;flex-wrap:wrap}
.downline-row:last-child{border:none}

.wallet-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.wallet-item{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#F8FAFC;border-radius:8px;border:1px solid #F1F5F9}
.wallet-coin{font-size:14px;font-weight:700;color:#2563EB;min-width:44px}
.wallet-vals{font-size:12px}

.txn-table-wrap{overflow-x:auto;border:1px solid #F1F5F9;border-radius:8px}
.txn-table{width:100%;border-collapse:collapse;font-size:12px;min-width:400px}
.txn-table th{padding:8px 10px;text-align:left;font-size:11px;font-weight:600;color:#64748B;background:#F8FAFC;text-transform:uppercase;letter-spacing:.3px;white-space:nowrap}
.txn-table td{padding:8px 10px;border-top:1px solid #F1F5F9}

.addr-row{padding:8px 12px;border-bottom:1px solid #F1F5F9}
.addr-row:last-child{border:none}
.addr{max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

@media(max-width:768px){
  .desktop-only{display:none}
  .mobile-only{display:block}
  .toolbar{flex-direction:column;align-items:stretch}
  .search-input{width:100%}
  .modal-card{padding:16px;width:100%}
  .modal-form{flex-direction:column}
  .mini-input{width:100%}
  .detail-panel{width:100%;max-height:85vh;border-radius:12px}
  .detail-panel__header{padding:16px}
  .detail-panel__body{padding:16px}
  .info-grid{grid-template-columns:1fr}
  .wallet-grid{grid-template-columns:1fr}
}
</style>
