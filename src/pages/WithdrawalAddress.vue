<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Withdrawal Address</span><button class="page-header__action" @click="showAdd=true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button></div>
    <div v-if="addresses.length === 0" class="empty-state">
      <div class="empty-state__icon">📋</div>
      <div class="empty-state__text">No saved addresses</div>
      <button class="btn btn-primary btn-sm mt-16" @click="showAdd=true">Add Address</button>
    </div>
    <div v-else class="page-content">
      <div v-for="(addr, i) in addresses" :key="i" class="card-flat mb-12">
        <div class="flex justify-between items-center">
          <div><div class="fw-600 fs-14">{{ addr.label }}</div><div class="fs-12 text-muted mt-4">{{ addr.coin }} · {{ addr.network }}</div><div class="fs-12 text-muted mt-4" style="word-break:break-all">{{ addr.address }}</div></div>
          <button @click="addresses.splice(i,1)" style="color:var(--danger);font-size:12px;">Delete</button>
        </div>
      </div>
    </div>
    <!-- Add Modal -->
    <div v-if="showAdd" class="modal-overlay" @click.self="showAdd=false">
      <div class="modal-content slide-up">
        <h3 class="fs-16 fw-600 mb-16">Add Withdrawal Address</h3>
        <div class="input-group"><label>Label</label><input v-model="newAddr.label" class="input-field" placeholder="e.g. My Binance"/></div>
        <div class="input-group"><label>Coin</label><select v-model="newAddr.coin" class="input-field"><option v-for="c in ['USDT','BTC','ETH','BNB','XRP','SOL']" :key="c">{{c}}</option></select></div>
        <div class="input-group"><label>Network</label><select v-model="newAddr.network" class="input-field"><option v-for="n in ['TRC20','ERC20','BEP20']" :key="n">{{n}}</option></select></div>
        <div class="input-group"><label>Address</label><input v-model="newAddr.address" class="input-field" placeholder="Enter wallet address"/></div>
        <button class="btn btn-primary" @click="addAddress">Save</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'

const showAdd = ref(false)
const addresses = ref([])
const newAddr = reactive({ label: '', coin: 'USDT', network: 'TRC20', address: '' })

const fetchAddresses = async () => {
  const token = localStorage.getItem('nt_token')
  if(!token) return
  try {
    const res = await fetch('http://localhost:3001/api/user/addresses', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    if(data.success) addresses.value = data.data
  } catch(e){console.error(e)}
}

const addAddress = async () => {
    const token = localStorage.getItem('nt_token')
    if(newAddr.label && newAddr.address) {
        try {
            const res = await fetch('http://localhost:3001/api/user/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newAddr)
            })
            const data = await res.json()
            if(data.success) {
                addresses.value.unshift(data.data)
                showAdd.value = false
                newAddr.label = ''; newAddr.address = ''
            } else { alert(data.message) }
        } catch(e){console.error(e)}
    }
}

const removeAddress = async (id, index) => {
    if(!confirm('Delete this address?')) return
    const token = localStorage.getItem('nt_token')
    try {
        const res = await fetch(`http://localhost:3001/api/user/addresses/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if(data.success) addresses.value.splice(index, 1)
        else alert(data.message)
    } catch(e){console.error(e)}
}

onMounted(fetchAddresses)
</script>
<style scoped>
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;display:flex;align-items:flex-end;justify-content:center}
.modal-content{background:var(--bg-card);border-radius:var(--radius-xl) var(--radius-xl) 0 0;padding:24px;width:100%;max-width:480px}
</style>
