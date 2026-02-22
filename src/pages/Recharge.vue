<template>
  <div class="page">
    <div class="page-header">
      <button class="page-header__back" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <span class="page-header__title">Deposit</span>
      <span style="width:32px"></span>
    </div>

    <div class="page-content">
      <div class="card mb-16">
        <div class="form-group">
          <label>Select Coin</label>
          <select v-model="coin" class="input-field" @change="updateAddress">
            <option v-for="c in coins" :key="c" :value="c">{{c}}</option>
          </select>
        </div>
        <div class="form-group mt-12">
          <label>Select Network</label>
          <div class="network-tabs">
            <button v-for="n in networks" :key="n" @click="network = n; updateAddress()" :class="{active: network === n}" class="network-tab">
              {{ n }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="address" class="qr-section">
        <div class="qr-placeholder">
          <img v-if="qrUrl" :src="qrUrl" alt="QR Code" width="160" height="160" />
          <div v-else class="shimmer qr-shimmer"></div>
        </div>
        <div class="address-box mt-16">
          <label class="fs-12 text-muted">Deposit Address</label>
          <div class="address-text">{{ address }}</div>
          <button class="btn btn-primary btn-sm mt-12" @click="copyAddr">Copy Address</button>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-state__icon">⚠️</div>
        <div class="empty-state__text">No deposit address available for {{ coin }} ({{ network }}). Please contact support.</div>
        <a v-if="supportLink" :href="supportLink" target="_blank" class="btn btn-outline btn-sm mt-16">Contact Support</a>
      </div>

      <div class="card mt-16 warning-card">
        <p class="fs-12">⚠️ Important: Only send <strong>{{ coin }} ({{ network }})</strong> to this address. Sending any other coin or using a different network will result in permanent loss.</p>
      </div>

      <div class="instructions card mt-16">
        <h4 class="fs-14 fw-600 mb-8">Deposit Instructions</h4>
        <ul class="fs-13 text-secondary">
          <li>1. Select the coin and network you wish to deposit.</li>
          <li>2. Copy the deposit address or scan the QR code.</li>
          <li>3. Send the amount from your wallet or exchange.</li>
          <li>4. After successful transfer, your balance will be updated automatically upon blockchain confirmation (usually 5-10 mins).</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import API_BASE_URL from '../config/api.js'

const coin = ref('USDT')
const network = ref('TRC20')
const coins = ['USDT','BTC','ETH','BNB','XRP','SOL','DOGE','ADA','DOT','AVAX']
const networks = ['TRC20','ERC20','BEP20']

const address = ref('')
const qrUrl = ref('')
const supportLink = ref('')
const allMethods = ref([])

const fetchMethods = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/config/public`).then(r => r.json())
    if (res.success && res.data.deposit_addresses) {
      allMethods.value = res.data.deposit_addresses
      supportLink.value = res.data.support_link || ''
      updateAddress()
    }
  } catch (err) {
    console.error(err)
  }
}

const updateAddress = () => {
  const methods = allMethods.value || []
  // Filter by coin and network
  const filtered = methods.filter(m => m.coin === coin.value && m.network === network.value)
  
  if (filtered.length > 0) {
    // Pick first or random
    address.value = filtered[0].address
    qrUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address.value}`
  } else {
    address.value = ''
    qrUrl.value = ''
  }
}

onMounted(fetchMethods)

const copyAddr = () => {
  if (!address.value) return
  navigator.clipboard?.writeText(address.value).then(() => {
    alert('Address copied to clipboard!')
  }).catch(() => {
    alert('Failed to copy. Please select and copy manually.')
  })
}
</script>

<style scoped>
.form-group label { display: block; font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-bottom: 6px; }
.network-tabs { display: flex; gap: 8px; }
.network-tab { flex: 1; padding: 10px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-weight: 500; color: var(--text-secondary); background: var(--bg-card); transition: all 0.2s; }
.network-tab.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2); }

.qr-section { display: flex; flex-direction: column; align-items: center; padding: 32px 24px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light); }
.qr-placeholder { padding: 12px; background: white; border-radius: 12px; border: 1px solid var(--border-light); box-shadow: var(--shadow-sm); }
.qr-shimmer { width: 160px; height: 160px; border-radius: 8px; }

.address-box { width: 100%; text-align: center; }
.address-text { font-size: 14px; font-weight: 600; font-family: monospace; word-break: break-all; padding: 12px; background: var(--bg-input); border-radius: var(--radius-md); margin-top: 6px; border: 1px solid var(--border-light); }

.warning-card { background: #FFFBEB !important; border-left: 4px solid #F59E0B !important; color: #92400E; }
.instructions ul { list-style: none; }
.instructions li { margin-bottom: 8px; line-height: 1.4; }

.empty-state { padding: 40px 24px; text-align: center; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border); }
.empty-state__icon { font-size: 32px; margin-bottom: 12px; }
.empty-state__text { font-size: 14px; color: var(--text-secondary); }
</style>
