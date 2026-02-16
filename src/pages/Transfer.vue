<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Transfer</span><span style="width:32px"></span></div>
    <div class="page-content">
      <div class="transfer-direction"><div class="transfer-box"><span class="fs-12 text-muted">From</span><div class="fw-600">{{ fromAccount }}</div></div>
        <button class="swap-btn" @click="swapAccounts"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4m4-4H3"/></svg></button>
        <div class="transfer-box"><span class="fs-12 text-muted">To</span><div class="fw-600">{{ toAccount }}</div></div>
      </div>
      <div class="input-group mt-16"><label>Coin</label>
        <select v-model="coin" class="input-field"><option v-for="c in coins" :key="c" :value="c">{{c}}</option></select>
      </div>
      <div class="input-group"><label>Amount</label><input v-model="amount" type="number" class="input-field" placeholder="Enter transfer amount"/></div>
      <div class="fs-12 text-muted mb-16">Available: 0.00 {{ coin }}</div>
      <button class="btn btn-primary">Confirm Transfer</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const fromAccount = ref('Spot Account')
const toAccount = ref('Contract Account')
const coin = ref('USDT')
const amount = ref('')
const coins = ['USDT','BTC','ETH','BNB','XRP','SOL']
const swapAccounts = () => { const tmp = fromAccount.value; fromAccount.value = toAccount.value; toAccount.value = tmp }
</script>
<style scoped>
.transfer-direction{display:flex;align-items:center;gap:12px;margin-top:8px}
.transfer-box{flex:1;padding:14px;background:var(--bg-input);border-radius:var(--radius-md);text-align:center}
.swap-btn{width:36px;height:36px;border-radius:50%;border:1.5px solid var(--primary);display:flex;align-items:center;justify-content:center}
</style>
