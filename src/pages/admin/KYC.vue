<template>
  <div>
    <div class="toolbar">
      <div class="tab-filters"><button v-for="s in ['pending','approved','rejected']" :key="s" class="filter-btn" :class="{active:filter===s}" @click="filter=s;fetchUsers()">{{ s }}</button></div>
    </div>
    <div v-if="users.length===0" class="empty-state-admin">No {{ filter }} KYC applications</div>
    <div class="kyc-grid">
      <div v-for="u in users" :key="u.id" class="kyc-card">
        <div class="kyc-header">
          <div class="kyc-email-wrap"><div class="fw-600 fs-14">{{ u.email }}</div><div class="fs-11 text-muted">VIP: {{ u.vipLevel }} · {{ new Date(u.createdAt).toLocaleDateString() }}</div></div>
          <span class="badge-sm" :class="u.kycStatus">{{ u.kycStatus }}</span>
        </div>
        <div class="kyc-fields">
          <div class="kyc-field"><label>Full Name</label><span>{{ u.kycName || '—' }}</span></div>
          <div class="kyc-field"><label>ID Number</label><span>{{ u.kycIdNumber || '—' }}</span></div>
          <div class="kyc-field"><label>Country</label><span>{{ u.kycCountry || '—' }}</span></div>
        </div>
        <div v-if="u.kycStatus==='pending'" class="kyc-actions">
          <button class="action-btn approve" @click="review(u.id,'approved')">✓ Approve</button>
          <button class="action-btn reject" @click="review(u.id,'rejected')">✕ Reject</button>
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

const users = ref([])
const filter = ref('pending')

const fetchUsers = async () => {
  const res = await fetch(`${API}/admin/users?limit=100`, { headers }).then(r => r.json())
  if (res.success) users.value = res.data.users.filter(u => u.kycStatus === filter.value)
}

const review = async (id, status) => {
  await fetch(`${API}/admin/users/${id}`, { method: 'PUT', headers, body: JSON.stringify({ kycStatus: status }) })
  fetchUsers()
}

onMounted(fetchUsers)
</script>
<style scoped>
.toolbar{margin-bottom:16px}
.tab-filters{display:flex;gap:4px;background:white;border-radius:8px;padding:4px;border:1px solid #E8ECF2;flex-wrap:wrap}
.filter-btn{padding:6px 16px;border:none;border-radius:6px;background:transparent;font-size:13px;font-weight:500;cursor:pointer;text-transform:capitalize;color:#6B7280}
.filter-btn.active{background:#7C3AED;color:white}
.kyc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px}
.kyc-card{background:white;border-radius:12px;padding:20px;border:1px solid #E8ECF2}
.kyc-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;gap:8px}
.kyc-email-wrap{min-width:0;overflow:hidden}
.kyc-email-wrap .fw-600{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kyc-fields{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
.kyc-field label{display:block;font-size:10px;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px}
.kyc-field span{font-size:14px;font-weight:500;color:#1A1D26;word-break:break-all}
.kyc-actions{display:flex;gap:8px}
.action-btn{padding:8px 16px;border-radius:6px;border:none;font-size:13px;cursor:pointer;font-weight:500;flex:1;text-align:center}
.action-btn.approve{background:#E6F9F1;color:#00C087}.action-btn.approve:hover{background:#00C087;color:white}
.action-btn.reject{background:#FFF1F3;color:#FF4D6A}.action-btn.reject:hover{background:#FF4D6A;color:white}
.badge-sm{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500;white-space:nowrap}
.badge-sm.pending{background:#FFF8ED;color:#FFB84D}.badge-sm.approved{background:#E6F9F1;color:#00C087}.badge-sm.rejected{background:#FFF1F3;color:#FF4D6A}.badge-sm.none{background:#F4F6FA;color:#9CA3AF}
.empty-state-admin{text-align:center;padding:48px;color:#9CA3AF;font-size:14px;background:white;border-radius:12px}
.fw-600{font-weight:600}.fs-11{font-size:11px}.fs-14{font-size:14px}.text-muted{color:#9CA3AF}

@media(max-width:768px){
  .kyc-grid{grid-template-columns:1fr;gap:10px}
  .kyc-card{padding:14px}
  .kyc-fields{grid-template-columns:1fr;gap:10px}
  .filter-btn{padding:5px 12px;font-size:12px}
}
@media(max-width:480px){
  .kyc-fields{gap:8px}
  .kyc-field span{font-size:13px}
}
</style>
