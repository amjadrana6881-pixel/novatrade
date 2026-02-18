<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Deposit</span><span style="width:32px"></span></div>
    <div class="page-content">
      <div class="input-group"><label>Coin</label>
        <select v-model="coin" class="input-field"><option v-for="c in coins" :key="c" :value="c">{{c}}</option></select></div>
      <div class="input-group"><label>Network</label>
        <select v-model="network" class="input-field"><option v-for="n in networks" :key="n" :value="n">{{n}}</option></select></div>
      <div class="qr-section">
        <div class="qr-placeholder">
          <img v-if="qrUrl" :src="qrUrl" alt="QR Code" width="120" height="120" style="border-radius:4px"/>
          <svg v-else width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="8" fill="var(--bg-input)"/><text x="60" y="66" text-anchor="middle" fill="var(--text-muted)" font-size="11">Loading...</text></svg>
        </div>
        <div class="address-box mt-12"><label class="fs-12 text-muted">Deposit Address</label><div class="address-text">{{ address }}</div>
          <button class="btn btn-outline btn-sm mt-8" @click="copyAddr">Copy Address</button></div>
      </div>
      <div class="card mt-16" style="background:var(--warning-light);border:none;">
        <p class="fs-12" style="color:var(--warning)">⚠️ Please only send {{ coin }} to this address. Sending other assets may result in permanent loss.</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

const coin = ref('USDT')
const network = ref('TRC20')
const coins = ['USDT','BTC','ETH','BNB','XRP','SOL','DOGE','ADA','DOT','AVAX']
const networks = ['TRC20','ERC20','BEP20']
const address = ref('')

const trc20Addresses = [
  'THPvaUhoh2Qn2y9THCZML3H815dbwQG1sZ',
  'TKr99jX4y4rF1wD9x815dbwQG1sZTHPvaU',
  'TMuA6YqfCeX8Dgm1x815dbwQG1sZTHPvaU',
  'TVjs55o77Qn2y9THCZML3H815dbwQG1sZT',
  'TXp11qY4y4rF1wD9x815dbwQG1sZTHPvaU',
  'TYz88pQfCeX8Dgm1x815dbwQG1sZTHPvaU',
  'TAa22bUhoh2Qn2y9THCZML3H815dbwQG1s',
  'TBc33cX4y4rF1wD9x815dbwQG1sZTHPvaU',
  'TCd44dQfCeX8Dgm1x815dbwQG1sZTHPvaU',
  'TEf55eUhoh2Qn2y9THCZML3H815dbwQG1s'
]

const qrUrl = ref('')

onMounted(() => {
  // Randomly select one address
  const randomIndex = Math.floor(Math.random() * trc20Addresses.length)
  address.value = trc20Addresses[randomIndex]
  qrUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address.value}`
})

const copyAddr = () => { 
  navigator.clipboard?.writeText(address.value) 
  alert('Address copied!')
}
</script>
<style scoped>
.qr-section{text-align:center;padding:24px;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid var(--border-light)}
.qr-placeholder{display:inline-block}
.address-box{text-align:center}
.address-text{font-size:14px;font-weight:500;word-break:break-all;padding:8px;background:var(--bg-input);border-radius:var(--radius-sm);margin-top:4px}
</style>
