<template>
  <div>
    <div class="toolbar"><input v-model="search" class="search-input" placeholder="Search by email..." @input="fetchUsers"/><span class="result-count">{{ total }} users</span></div>
    
    <!-- Desktop Table -->
    <div class="table-wrap desktop-only">
      <table class="admin-table">
        <thead><tr><th>Email</th><th>VIP</th><th>KYC</th><th>Invite Code</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td><div class="fw-500">{{ u.email }}</div><div class="fs-11 text-muted">{{ u.nickname || '—' }}</div></td>
            <td><select :value="u.vipLevel" @change="updateUser(u.id, {vipLevel: $event.target.value})" class="mini-select">
              <option v-for="v in ['V','V1','V2','V3','V4','V5','V6','V7','V8']" :key="v">{{v}}</option></select></td>
            <td><span class="badge-sm" :class="u.kycStatus">{{ u.kycStatus }}</span></td>
            <td class="fs-12 mono">{{ u.inviteCode }}</td>
            <td><button class="toggle-btn" :class="{active:u.isActive}" @click="updateUser(u.id, {isActive:!u.isActive})">{{ u.isActive?'Active':'Blocked' }}</button></td>
            <td class="fs-12 text-muted">{{ new Date(u.createdAt).toLocaleDateString() }}</td>
            <td><button class="action-btn" @click="openWallet(u)">💰 Wallet</button></td>
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
          <div class="ucm-field"><label>Status</label><button class="toggle-btn" :class="{active:u.isActive}" @click="updateUser(u.id, {isActive:!u.isActive})">{{ u.isActive?'Active':'Blocked' }}</button></div>
        </div>
        <button class="action-btn full-w" @click="openWallet(u)">💰 Manage Wallet</button>
      </div>
    </div>

    <div class="pagination"><button :disabled="page<=1" @click="page--;fetchUsers()">← Prev</button><span>{{ page }}/{{ pages }}</span><button :disabled="page>=pages" @click="page++;fetchUsers()">Next →</button></div>

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

onMounted(fetchUsers)
</script>
<style scoped>
.toolbar{display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap}
.search-input{padding:8px 14px;border:1px solid #E8ECF2;border-radius:8px;font-size:14px;width:260px;outline:none;max-width:100%}
.search-input:focus{border-color:#1A6CFF}
.result-count{font-size:13px;color:#6B7280}
.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
.admin-table{width:100%;border-collapse:separate;border-spacing:0;background:white;border-radius:12px;border:1px solid #E8ECF2;overflow:hidden;min-width:650px}
.admin-table th{text-align:left;padding:12px 14px;font-size:12px;font-weight:600;color:#6B7280;background:#F4F6FA;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
.admin-table td{padding:12px 14px;border-top:1px solid #F4F6FA;font-size:13px}
.mini-select{padding:4px 8px;border:1px solid #E8ECF2;border-radius:6px;font-size:12px;background:white;cursor:pointer}
.toggle-btn{padding:4px 10px;border-radius:4px;border:none;font-size:11px;font-weight:600;cursor:pointer;background:#FFF1F3;color:#FF4D6A}
.toggle-btn.active{background:#E6F9F1;color:#00C087}
.action-btn{padding:6px 12px;border-radius:6px;border:1px solid #E8ECF2;background:white;font-size:12px;cursor:pointer}
.action-btn:hover{background:#F4F6FA}
.action-btn.success{background:#00C087;color:white;border:none}
.action-btn.full-w{width:100%;margin-top:10px;padding:8px;font-size:13px}
.badge-sm{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500}
.badge-sm.none{background:#F4F6FA;color:#9CA3AF}.badge-sm.pending{background:#FFF8ED;color:#FFB84D}.badge-sm.approved{background:#E6F9F1;color:#00C087}.badge-sm.rejected{background:#FFF1F3;color:#FF4D6A}
.pagination{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:16px;font-size:13px}
.pagination button{padding:6px 14px;border:1px solid #E8ECF2;border-radius:6px;background:white;cursor:pointer;font-size:12px}
.pagination button:disabled{opacity:.4;cursor:not-allowed}
.mono{font-family:monospace}
.fw-500{font-weight:500}.fs-11{font-size:11px}.fs-12{font-size:12px}.fs-14{font-size:14px}.text-muted{color:#9CA3AF}

/* Mobile card layout */
.mobile-only{display:none}
.desktop-only{display:block}
.user-card-mobile{background:white;border-radius:12px;border:1px solid #E8ECF2;padding:14px;margin-bottom:10px}
.ucm-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:8px}
.ucm-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:4px}
.ucm-field{display:flex;flex-direction:column;gap:4px}
.ucm-field label{font-size:10px;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px}

/* Modal */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:999;padding:16px}
.modal-card{background:white;border-radius:12px;padding:24px;width:420px;max-width:100%}
.modal-card h3{font-size:16px;font-weight:600;margin-bottom:16px;word-break:break-all}
.modal-form{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.mini-input{padding:6px 10px;border:1px solid #E8ECF2;border-radius:6px;font-size:13px;width:100px}
.wallet-msg{margin-top:12px;padding:8px;background:#E6F9F1;color:#00C087;border-radius:6px;font-size:13px}
.close-modal-btn{margin-top:12px;padding:6px 16px;border:1px solid #E8ECF2;border-radius:6px;background:white;cursor:pointer;font-size:13px}

@media(max-width:768px){
  .desktop-only{display:none}
  .mobile-only{display:block}
  .toolbar{flex-direction:column;align-items:stretch}
  .search-input{width:100%}
  .modal-card{padding:16px;width:100%}
  .modal-form{flex-direction:column}
  .mini-input{width:100%}
}
</style>
