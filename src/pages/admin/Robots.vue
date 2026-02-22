<template>
  <div>
    <!-- Desktop Table -->
    <div class="table-wrap desktop-only">
      <table class="admin-table">
        <thead><tr><th>Name</th><th>Price (USDT)</th><th>Fixed Profit</th><th>Daily %</th><th>Period</th><th>Status</th><th></th></tr></thead>
        <tbody>
          <tr v-for="r in robots" :key="r.id">
            <td><input v-model="r.name" class="inline-input" @blur="save(r)"/></td>
            <td><input v-model.number="r.price" type="number" class="inline-input sm" @blur="save(r)"/></td>
            <td><input v-model.number="r.fixedProfit" type="number" step="0.01" class="inline-input sm" @blur="save(r)"/></td>
            <td><input v-model.number="r.dailyReturn" type="number" step="0.1" class="inline-input sm" @blur="save(r)"/></td>
            <td><input v-model.number="r.period" type="number" class="inline-input sm" @blur="save(r)"/></td>
            <td><button class="toggle-btn" :class="{active:r.isActive}" @click="r.isActive=!r.isActive;save(r)">{{ r.isActive?'Active':'Off' }}</button></td>
            <td><span v-if="saveMsg===r.id" class="saved-msg">✓</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="mobile-only">
      <div v-for="r in robots" :key="r.id" class="robot-card-m">
        <div class="rcm-header">
          <input v-model="r.name" class="robot-name-input" @blur="save(r)"/>
          <button class="toggle-btn" :class="{active:r.isActive}" @click="r.isActive=!r.isActive;save(r)">{{ r.isActive?'Active':'Off' }}</button>
        </div>
        <div class="rcm-grid">
          <div class="rcm-field"><label>Price</label><input v-model.number="r.price" type="number" class="inline-input" @blur="save(r)"/></div>
          <div class="rcm-field"><label>Fixed Profit</label><input v-model.number="r.fixedProfit" type="number" step="0.01" class="inline-input" @blur="save(r)"/></div>
          <div class="rcm-field"><label>Daily %</label><input v-model.number="r.dailyReturn" type="number" step="0.1" class="inline-input" @blur="save(r)"/></div>
          <div class="rcm-field"><label>Days</label><input v-model.number="r.period" type="number" class="inline-input" @blur="save(r)"/></div>
        </div>
        <span v-if="saveMsg===r.id" class="saved-msg">✓ Saved</span>
      </div>
    </div>

    <div class="info-box">💡 All fields editable. <strong>Fixed Return</strong> = exact USDT return after lock period ends. <strong>Period</strong> = lock duration in days. Users only need enough balance to start staking (no VIP restriction).</div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import API_BASE_URL from '../../config/api.js'
const API = `${API_BASE_URL}/api`
const token = localStorage.getItem('nt_admin_token')
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

const robots = ref([])
const saveMsg = ref(null)

const fetchRobots = async () => {
  const res = await fetch(`${API}/admin/robots`, { headers }).then(r => r.json())
  if (res.success) robots.value = res.data
}

const save = async (r) => {
  await fetch(`${API}/admin/robots/${r.id}`, { method: 'PUT', headers, body: JSON.stringify({ name: r.name, price: r.price, dailyReturn: r.dailyReturn, fixedProfit: r.fixedProfit, period: r.period, minLevel: r.minLevel, isActive: r.isActive }) })
  saveMsg.value = r.id
  setTimeout(() => saveMsg.value = null, 2000)
}

onMounted(fetchRobots)
</script>
<style scoped>
.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
.admin-table{width:100%;border-collapse:separate;border-spacing:0;background:white;border-radius:12px;border:1px solid #E8ECF2;overflow:hidden;min-width:600px}
.admin-table th{text-align:left;padding:12px 14px;font-size:12px;font-weight:600;color:#6B7280;background:#F4F6FA;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
.admin-table td{padding:10px 14px;border-top:1px solid #F4F6FA}
.inline-input{border:1px solid transparent;padding:6px 8px;border-radius:6px;font-size:13px;width:100%;background:#F4F6FA;transition:border .15s;box-sizing:border-box}
.inline-input:focus{border-color:#1A6CFF;outline:none;background:white}
.inline-input.sm{width:80px}
.mini-select{padding:6px 8px;border:1px solid #E8ECF2;border-radius:6px;font-size:12px;background:white;cursor:pointer;width:100%}
.toggle-btn{padding:4px 10px;border-radius:4px;border:none;font-size:11px;font-weight:600;cursor:pointer;background:#FFF1F3;color:#FF4D6A;white-space:nowrap}
.toggle-btn.active{background:#E6F9F1;color:#00C087}
.saved-msg{color:#00C087;font-size:12px;font-weight:500}
.info-box{margin-top:16px;padding:12px 16px;background:white;border-radius:8px;border:1px solid #E8ECF2;font-size:13px;color:#6B7280}

.mobile-only{display:none}.desktop-only{display:block}
.robot-card-m{background:white;border-radius:12px;border:1px solid #E8ECF2;padding:14px;margin-bottom:10px}
.rcm-header{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.robot-name-input{flex:1;border:1px solid #E8ECF2;padding:8px 10px;border-radius:6px;font-size:14px;font-weight:500}
.robot-name-input:focus{border-color:#1A6CFF;outline:none}
.rcm-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.rcm-field{display:flex;flex-direction:column;gap:4px}
.rcm-field label{font-size:10px;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px}

@media(max-width:768px){
  .desktop-only{display:none}
  .mobile-only{display:block}
}
</style>
