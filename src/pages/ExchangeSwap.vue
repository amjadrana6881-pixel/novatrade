<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Exchange</span><span style="width:32px"></span></div>
    <div class="page-content">
      <div class="swap-card">
        <div class="swap-box"><div class="flex justify-between items-center mb-8"><span class="fs-12 text-muted">From</span><span class="fs-12 text-muted">Available: 0.00</span></div>
          <div class="flex items-center gap-8"><select v-model="fromCoin" class="swap-select"><option v-for="c in coins" :key="c">{{c}}</option></select><input v-model="fromAmount" type="number" class="swap-input" placeholder="0.00"/></div></div>
        <div class="swap-arrow" @click="swapCoins"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4m4-4H3"/></svg></div>
        <div class="swap-box"><div class="flex justify-between items-center mb-8"><span class="fs-12 text-muted">To</span><span class="fs-12 text-muted">Available: 0.00</span></div>
          <div class="flex items-center gap-8"><select v-model="toCoin" class="swap-select"><option v-for="c in coins" :key="c">{{c}}</option></select><input v-model="toAmount" type="number" class="swap-input" placeholder="0.00" disabled/></div></div>
      </div>
      <div class="card mt-12">
        <div class="detail-row"><span>Exchange Rate</span><span class="fw-500">1 {{fromCoin}} ≈ -- {{toCoin}}</span></div>
        <div class="detail-row"><span>Fee</span><span>0%</span></div>
      </div>
      <button class="btn btn-primary mt-16">Confirm Exchange</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const fromCoin = ref('USDT')
const toCoin = ref('BTC')
const fromAmount = ref('')
const toAmount = ref('')
const coins = ['USDT','BTC','ETH','BNB','XRP','SOL','DOGE','ADA','DOT','AVAX']
const swapCoins = () => { const t = fromCoin.value; fromCoin.value = toCoin.value; toCoin.value = t }
</script>
<style scoped>
.swap-card{position:relative}
.swap-box{padding:16px;background:var(--bg-input);border-radius:var(--radius-md);margin-bottom:4px}
.swap-select{border:none;background:var(--bg-card);padding:8px 12px;border-radius:var(--radius-sm);font-weight:600;font-size:15px;min-width:80px}
.swap-input{flex:1;border:none;background:transparent;text-align:right;font-size:20px;font-weight:600;outline:none}
.swap-arrow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:36px;height:36px;border-radius:50%;background:var(--bg-card);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:1}
.detail-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-light);font-size:13px}
</style>
