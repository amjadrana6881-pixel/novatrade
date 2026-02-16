<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Withdraw</span><span style="width:32px"></span></div>
    <div class="page-content">
      <div class="input-group"><label>Coin</label>
        <select v-model="coin" class="input-field"><option v-for="c in coins" :key="c" :value="c">{{c}}</option></select></div>
      <div class="input-group"><label>Network</label>
        <select v-model="network" class="input-field"><option v-for="n in networks" :key="n" :value="n">{{n}}</option></select></div>
      <div class="input-group"><label>Withdrawal Address</label>
        <input v-model="address" class="input-field" placeholder="Enter or paste your withdrawal address" /></div>
      <div class="input-group"><label>Amount</label>
        <div class="input-with-action"><input v-model="amount" type="number" class="input-field" placeholder="Minimum 10 USDT" /><button class="input-action-btn" @click="amount = balance">All</button></div></div>
      <div class="flex justify-between fs-12 text-muted mb-8"><span>Available: {{ balance }} {{ coin }}</span><span>Fee: {{ fee }} {{ coin }}</span></div>
      <div class="flex justify-between fs-13 mb-16"><span>You will receive</span><span class="fw-600">{{ Math.max(0, (parseFloat(amount || 0) - fee)).toFixed(2) }} {{ coin }}</span></div>
      <div class="input-group"><label>Transaction Password</label>
        <input v-model="txPassword" type="password" class="input-field" placeholder="Enter transaction password" /></div>
      <button class="btn btn-primary mt-8">Submit Withdrawal</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const coin = ref('USDT')
const network = ref('TRC20')
const address = ref('')
const amount = ref('')
const txPassword = ref('')
const balance = 0.00
const fee = 1
const coins = ['USDT','BTC','ETH','BNB','XRP','SOL','DOGE','ADA','DOT','AVAX']
const networks = ['TRC20','ERC20','BEP20']
</script>
