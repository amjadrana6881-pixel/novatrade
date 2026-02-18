<template>
  <div class="page">
    <div class="page-header">
      <button class="page-header__back" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <span class="page-header__title">Withdraw</span>
      <span style="width:32px"></span>
    </div>
    <div class="page-content">
      <div class="input-group">
        <label>Coin</label>
        <select v-model="coin" class="input-field" @change="updateBalance">
          <option v-for="c in coins" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="input-group">
        <label>Network</label>
        <select v-model="network" class="input-field">
          <option v-for="n in networks" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
      <div class="input-group">
        <label>Withdrawal Address</label>
        <input v-model="address" class="input-field" placeholder="Enter or paste your withdrawal address" />
      </div>
      <div class="input-group">
        <label>Amount</label>
        <div class="input-with-action">
          <input v-model="amount" type="number" class="input-field" :placeholder="`Minimum 10 ${coin}`" />
          <button class="input-action-btn" @click="amount = balance">All</button>
        </div>
      </div>
      <div class="flex justify-between fs-12 text-muted mb-8">
        <span>Available: <span class="fw-600" style="color:var(--text)">{{ balance }} {{ coin }}</span></span>
        <span>Fee: {{ fee }} {{ coin }}</span>
      </div>
      <div class="flex justify-between fs-13 mb-16">
        <span>You will receive</span>
        <span class="fw-600">{{ receiveAmount }} {{ coin }}</span>
      </div>
      <div class="input-group">
        <label>Transaction Password</label>
        <input v-model="txPassword" type="password" class="input-field" placeholder="Enter 6-digit transaction password" maxlength="6" inputmode="numeric"/>
      </div>
      <div v-if="msg" class="feedback-msg" :class="success ? 'success' : 'error'">{{ msg }}</div>
      <button class="btn btn-primary mt-8" :disabled="loading" @click="submit">
        {{ loading ? 'Submitting...' : 'Submit Withdrawal' }}
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import API_BASE_URL from '../config/api.js'

const coin = ref('USDT')
const network = ref('TRC20')
const address = ref('')
const amount = ref('')
const txPassword = ref('')
const loading = ref(false)
const msg = ref('')
const success = ref(false)
const wallets = ref([])

const coins = ['USDT','BTC','ETH','BNB','XRP','SOL','DOGE','ADA','DOT','AVAX']
const networks = ['TRC20','ERC20','BEP20']

const fee = computed(() => coin.value === 'USDT' ? 1 : 0.0001)

const balance = computed(() => {
  const w = wallets.value.find(w => w.coin === coin.value && w.account === 'spot')
  return w ? parseFloat(w.available).toFixed(4) : '0.0000'
})

const receiveAmount = computed(() => {
  const amt = parseFloat(amount.value || 0)
  return Math.max(0, amt - fee.value).toFixed(4)
})

const updateBalance = () => { /* reactive via computed */ }

const fetchWallets = async () => {
  try {
    const token = localStorage.getItem('nt_token')
    const res = await fetch(`${API_BASE_URL}/api/wallet`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.success) wallets.value = data.data
  } catch (e) { console.error(e) }
}

const submit = async () => {
  msg.value = ''
  if (!address.value) return (msg.value = 'Please enter withdrawal address')
  if (!amount.value || parseFloat(amount.value) < 10) return (msg.value = `Minimum withdrawal is 10 ${coin.value}`)
  if (parseFloat(amount.value) > parseFloat(balance.value)) return (msg.value = 'Insufficient balance')
  if (!txPassword.value || txPassword.value.length !== 6) return (msg.value = 'Enter your 6-digit transaction password')

  loading.value = true
  try {
    const token = localStorage.getItem('nt_token')
    const res = await fetch(`${API_BASE_URL}/api/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        coin: coin.value,
        network: network.value,
        amount: parseFloat(amount.value),
        address: address.value,
        txPassword: txPassword.value
      })
    })
    const data = await res.json()
    if (data.success) {
      success.value = true
      msg.value = 'Withdrawal submitted! Pending admin review.'
      amount.value = ''
      address.value = ''
      txPassword.value = ''
      fetchWallets()
    } else {
      success.value = false
      msg.value = data.message || 'Withdrawal failed'
    }
  } catch (e) {
    success.value = false
    msg.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchWallets)
</script>
<style scoped>
.feedback-msg{margin-top:12px;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:500}
.feedback-msg.success{background:#E6F9F1;color:#00C087}
.feedback-msg.error{background:#FFF1F3;color:#FF4D6A}
</style>
