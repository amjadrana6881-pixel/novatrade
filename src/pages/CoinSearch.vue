<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Search</span><span style="width:32px"></span></div>
    <div style="padding:12px 16px;">
      <div style="position:relative;"><input v-model="query" class="input-field" style="padding-left:36px;background:var(--bg-input);border:none;border-radius:var(--radius-full);padding:10px 14px 10px 36px;" placeholder="Search coins..." autofocus/>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="position:absolute;left:12px;top:50%;transform:translateY(-50%)"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
    </div>
    <div class="page-content" style="padding-top:0;">
      <div v-for="coin in filtered" :key="coin.symbol" class="coin-row" @click="$router.push('/exchange')">
        <div class="coin-row__left"><div class="coin-icon" :style="{background:coin.color}">{{coin.symbol.slice(0,2)}}</div>
          <div><div class="coin-row__name">{{coin.symbol}}</div><div class="coin-row__sub">{{coin.name}}</div></div></div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const query = ref('')
const allCoins = [
  {symbol:'BTC',name:'Bitcoin',color:'#F7931A'},{symbol:'ETH',name:'Ethereum',color:'#627EEA'},{symbol:'BNB',name:'BNB',color:'#F3BA2F'},
  {symbol:'XRP',name:'XRP',color:'#23292F'},{symbol:'SOL',name:'Solana',color:'#9945FF'},{symbol:'ADA',name:'Cardano',color:'#0033AD'},
  {symbol:'DOGE',name:'Dogecoin',color:'#C2A633'},{symbol:'DOT',name:'Polkadot',color:'#E6007A'},{symbol:'AVAX',name:'Avalanche',color:'#E84142'},
  {symbol:'MATIC',name:'Polygon',color:'#8247E5'},{symbol:'LINK',name:'Chainlink',color:'#2A5ADA'},{symbol:'UNI',name:'Uniswap',color:'#FF007A'},
  {symbol:'LTC',name:'Litecoin',color:'#345D9D'},{symbol:'ATOM',name:'Cosmos',color:'#2E3148'},{symbol:'TRX',name:'TRON',color:'#FF0013'},
  {symbol:'SHIB',name:'Shiba Inu',color:'#FFA409'},{symbol:'FIL',name:'Filecoin',color:'#0090FF'},{symbol:'USDT',name:'Tether',color:'#26A17B'},
]
const filtered = computed(() => { const q = query.value.toLowerCase(); return q ? allCoins.filter(c => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)) : allCoins })
</script>
