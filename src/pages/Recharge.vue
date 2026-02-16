<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Deposit</span><span style="width:32px"></span></div>
    <div class="page-content">
      <div class="input-group"><label>Coin</label>
        <select v-model="coin" class="input-field"><option v-for="c in coins" :key="c" :value="c">{{c}}</option></select></div>
      <div class="input-group"><label>Network</label>
        <select v-model="network" class="input-field"><option v-for="n in networks" :key="n" :value="n">{{n}}</option></select></div>
      <div class="qr-section">
        <div class="qr-placeholder"><svg width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="8" fill="var(--bg-input)"/><text x="60" y="66" text-anchor="middle" fill="var(--text-muted)" font-size="11">QR Code</text></svg></div>
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
import { ref } from 'vue'
const coin = ref('USDT')
const network = ref('TRC20')
const coins = ['USDT','BTC','ETH','BNB','XRP','SOL','DOGE','ADA','DOT','AVAX']
const networks = ['TRC20','ERC20','BEP20']
const address = 'TNWgLnmR...kYjx8hZP'
const copyAddr = () => { navigator.clipboard?.writeText(address) }
</script>
<style scoped>
.qr-section{text-align:center;padding:24px;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid var(--border-light)}
.qr-placeholder{display:inline-block}
.address-box{text-align:center}
.address-text{font-size:14px;font-weight:500;word-break:break-all;padding:8px;background:var(--bg-input);border-radius:var(--radius-sm);margin-top:4px}
</style>
