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
        <select v-model="coin" class="input-field" @change="onCoinChange">
          <option v-for="c in coins" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="input-group">
        <label>Network</label>
        <select v-model="network" class="input-field">
          <option v-for="n in networks" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>

      <!-- Saved Addresses Selector -->
      <div class="input-group" v-if="filteredAddresses.length > 0">
        <label>Saved Addresses</label>
        <select v-model="selectedAddressId" class="input-field" @change="onSelectSavedAddress">
          <option value="">-- Select a saved address --</option>
          <option v-for="addr in filteredAddresses" :key="addr.id" :value="addr.id">
            {{ addr.label }} — {{ addr.address.slice(0,10) }}...{{ addr.address.slice(-6) }}
          </option>
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
          <button class="input-action-btn" @click="amount = availableForWithdraw">All</button>
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

      <!-- Withdrawal History -->
      <div class="history-section">
        <div class="history-header">
          <span class="history-title">Withdrawal History</span>
          <span class="history-count" v-if="withdrawalHistory.length > 0">{{ withdrawalHistory.length }}</span>
        </div>

        <div v-if="historyLoading" class="history-loading">Loading...</div>

        <div v-else-if="withdrawalHistory.length === 0" class="history-empty">
          <div class="history-empty-icon">📋</div>
          <div>No withdrawals yet</div>
        </div>

        <div v-else class="history-list">
          <div v-for="w in withdrawalHistory" :key="w.id" class="history-card">
            <div class="history-card-top">
              <div class="history-card-coin">
                <div class="history-coin-badge">{{ w.coin }}</div>
                <div>
                  <div class="fw-600 fs-14">{{ w.amount }} {{ w.coin }}</div>
                  <div class="fs-11 text-muted">{{ w.network }} · Fee: {{ w.fee }}</div>
                </div>
              </div>
              <span class="history-status" :class="w.status">{{ w.status }}</span>
            </div>
            <div class="history-card-row">
              <span class="text-muted">Address</span>
              <span class="mono fs-11 history-addr">{{ w.address.slice(0,12) }}...{{ w.address.slice(-8) }}</span>
            </div>
            <div class="history-card-row">
              <span class="text-muted">Receive</span>
              <span class="fw-500">{{ (w.amount - w.fee).toFixed(4) }} {{ w.coin }}</span>
            </div>
            <div class="history-card-row">
              <span class="text-muted">Date</span>
              <span class="fs-12">{{ formatDate(w.createdAt) }}</span>
            </div>
            <div v-if="w.txHash" class="history-card-row">
              <span class="text-muted">TX Hash</span>
              <span class="mono fs-11">{{ w.txHash.slice(0,16) }}...</span>
            </div>
          </div>
        </div>
      </div>
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
const savedAddresses = ref([])
const selectedAddressId = ref('')
const withdrawalHistory = ref([])
const historyLoading = ref(false)

const coins = ['USDT','BTC','ETH','BNB','XRP','SOL','DOGE','ADA','DOT','AVAX']
const networks = ['TRC20','ERC20','BEP20']

const fee = computed(() => coin.value === 'USDT' ? 1 : 0.0001)

const balance = computed(() => {
  const w = wallets.value.find(w => w.coin === coin.value && w.account === 'spot')
  return w ? parseFloat(w.available).toFixed(4) : '0.0000'
})

const availableForWithdraw = computed(() => {
  const bal = parseFloat(balance.value)
  return Math.max(0, bal).toFixed(4)
})

const receiveAmount = computed(() => {
  const amt = parseFloat(amount.value || 0)
  return Math.max(0, amt - fee.value).toFixed(4)
})

// Filter saved addresses by selected coin and network
const filteredAddresses = computed(() => {
  return savedAddresses.value.filter(a => a.coin === coin.value && a.network === network.value)
})

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const onCoinChange = () => {
  selectedAddressId.value = ''
  address.value = ''
}

const onSelectSavedAddress = () => {
  if (selectedAddressId.value) {
    const addr = savedAddresses.value.find(a => a.id === selectedAddressId.value)
    if (addr) {
      address.value = addr.address
      if (addr.coin !== coin.value) coin.value = addr.coin
      if (addr.network !== network.value) network.value = addr.network
    }
  } else {
    address.value = ''
  }
}

const fetchWallets = async () => {
  try {
    const token = localStorage.getItem('nt_token')
    const res = await fetch(`${API_BASE_URL}/api/wallet`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.success) {
      // The API returns { success, data: { wallets: [...], totalUSD, totalBTC } }
      wallets.value = data.data.wallets || data.data || []
    }
  } catch (e) { console.error(e) }
}

const fetchSavedAddresses = async () => {
  try {
    const token = localStorage.getItem('nt_token')
    const res = await fetch(`${API_BASE_URL}/api/user/addresses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.success) savedAddresses.value = data.data || []
  } catch (e) { console.error(e) }
}

const fetchWithdrawalHistory = async () => {
  historyLoading.value = true
  try {
    const token = localStorage.getItem('nt_token')
    const res = await fetch(`${API_BASE_URL}/api/withdraw`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.success) withdrawalHistory.value = data.data || []
  } catch (e) { console.error(e) }
  finally { historyLoading.value = false }
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
      selectedAddressId.value = ''
      fetchWallets()
      fetchWithdrawalHistory()
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

onMounted(() => {
  fetchWallets()
  fetchSavedAddresses()
  fetchWithdrawalHistory()
})
</script>
<style scoped>
.feedback-msg{margin-top:12px;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:500}
.feedback-msg.success{background:#E6F9F1;color:#00C087}
.feedback-msg.error{background:#FFF1F3;color:#FF4D6A}

/* History Section */
.history-section{margin-top:28px;padding-top:20px;border-top:1px solid var(--border-light, #E8ECF2)}
.history-header{display:flex;align-items:center;gap:8px;margin-bottom:14px}
.history-title{font-size:16px;font-weight:700;color:var(--text, #1A1D26)}
.history-count{background:var(--primary, #1A6CFF);color:white;font-size:11px;font-weight:600;padding:2px 8px;border-radius:10px;min-width:20px;text-align:center}
.history-loading{text-align:center;padding:24px;color:#9CA3AF;font-size:13px}
.history-empty{text-align:center;padding:32px 16px;color:#9CA3AF;font-size:13px}
.history-empty-icon{font-size:28px;margin-bottom:8px}
.history-list{display:flex;flex-direction:column;gap:10px}

.history-card{background:var(--bg-card, #fff);border:1px solid var(--border-light, #E8ECF2);border-radius:12px;padding:14px 16px;transition:box-shadow 0.15s}
.history-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px}
.history-card-coin{display:flex;align-items:center;gap:10px}
.history-coin-badge{background:linear-gradient(135deg,#1A6CFF,#4A9CFF);color:white;font-size:11px;font-weight:700;padding:6px 10px;border-radius:8px;letter-spacing:.5px}

.history-status{display:inline-block;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;text-transform:capitalize;letter-spacing:.3px}
.history-status.pending{background:#FFF8ED;color:#E6A01F;border:1px solid #FFE4A0}
.history-status.approved{background:#E6F9F1;color:#00A870;border:1px solid #B5EEDD}
.history-status.rejected{background:#FFF1F3;color:#E03E5A;border:1px solid #FFBDCA}

.history-card-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;font-size:13px;border-bottom:1px solid var(--border-light, #F4F6FA)}
.history-card-row:last-child{border:none}
.history-card-row .text-muted{color:#9CA3AF;font-size:12px}
.history-addr{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mono{font-family:'SF Mono',Monaco,Consolas,monospace}
.fw-500{font-weight:500}.fw-600{font-weight:600}.fs-11{font-size:11px}.fs-12{font-size:12px}.fs-14{font-size:14px}.text-muted{color:#9CA3AF}
</style>
