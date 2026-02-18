<template>
  <div class="page assets-page">
    <div class="assets-header">
      <h2 class="assets-header__title">Assets</h2>
      <div class="assets-header__actions">
        <router-link to="/coin-search" class="header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </router-link>
      </div>
    </div>

    <!-- Balance Overview Card -->
    <div class="balance-card">
      <div class="balance-card__label">Total Balance (USDT)</div>
      <div class="balance-card__amount">
        <span v-if="showBalance">{{ totalBalance.toFixed(2) }}</span>
        <span v-else>****</span>
        <button class="eye-btn" @click="showBalance = !showBalance">
          <svg v-if="showBalance" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        </button>
      </div>
      <div class="balance-card__btc">≈ {{ (totalBalance / 96500).toFixed(6) }} BTC</div>

      <!-- Action Buttons -->
      <div class="balance-actions">
        <router-link to="/recharge" class="balance-action-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          <span>Deposit</span>
        </router-link>
        <router-link to="/withdraw" class="balance-action-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          <span>Withdraw</span>
        </router-link>
        <router-link to="/transfer" class="balance-action-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          <span>Transfer</span>
        </router-link>
        <router-link to="/exchange-swap" class="balance-action-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"/></svg>
          <span>Exchange</span>
        </router-link>
      </div>
    </div>

    <!-- Account Tabs -->
    <div class="tabs">
      <button v-for="tab in ['Spot', 'Contract', 'Financial']" :key="tab" class="tab" :class="{ active: activeTab === tab }" @click="activeTab = tab">{{ tab }}</button>
    </div>

    <!-- Coin List -->
    <div class="assets-list">
      <div class="assets-list-header">
        <span>Coin</span>
        <span>Available</span>
        <span>USDT Value</span>
      </div>
      <div v-for="coin in walletCoins" :key="coin.symbol" class="asset-row">
        <div class="asset-row__left">
          <div class="coin-icon" :style="{ background: coin.color }">{{ coin.symbol.slice(0,2) }}</div>
          <div>
            <div class="fw-600 fs-14">{{ coin.symbol }}</div>
            <div class="fs-12 text-muted">{{ coin.name }}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="fw-600 fs-14">{{ coin.available }}</div>
        </div>
        <div class="text-right">
          <div class="fw-500 fs-13">${{ coin.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import API_BASE_URL from '../config/api.js'

const showBalance = ref(true)
const activeTab = ref('Spot')
const totalBalance = ref(0.00)

const walletCoins = ref([
  { symbol: 'USDT', name: 'Tether', available: '0.00', value: '0.00', color: '#26A17B' },
  { symbol: 'BTC', name: 'Bitcoin', available: '0.000000', value: '0.00', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', available: '0.000000', value: '0.00', color: '#627EEA' },
  { symbol: 'BNB', name: 'BNB', available: '0.000000', value: '0.00', color: '#F3BA2F' },
  { symbol: 'XRP', name: 'XRP', available: '0.000000', value: '0.00', color: '#23292F' },
  { symbol: 'SOL', name: 'Solana', available: '0.000000', value: '0.00', color: '#9945FF' },
  { symbol: 'ADA', name: 'Cardano', available: '0.000000', value: '0.00', color: '#0033AD' },
  { symbol: 'DOGE', name: 'Dogecoin', available: '0.000000', value: '0.00', color: '#C2A633' },
  { symbol: 'DOT', name: 'Polkadot', available: '0.000000', value: '0.00', color: '#E6007A' },
  { symbol: 'AVAX', name: 'Avalanche', available: '0.000000', value: '0.00', color: '#E84142' },
  { symbol: 'MATIC', name: 'Polygon', available: '0.000000', value: '0.00', color: '#8247E5' },
  { symbol: 'LINK', name: 'Chainlink', available: '0.000000', value: '0.00', color: '#2A5ADA' },
  { symbol: 'TRX', name: 'TRON', available: '0.000000', value: '0.00', color: '#FF0013' },
  { symbol: 'UNI', name: 'Uniswap', available: '0.000000', value: '0.00', color: '#FF007A' },
  { symbol: 'LTC', name: 'Litecoin', available: '0.000000', value: '0.00', color: '#345D9D' },
  { symbol: 'ATOM', name: 'Cosmos', available: '0.000000', value: '0.00', color: '#2E3148' },
  { symbol: 'SHIB', name: 'Shiba Inu', available: '0.000000', value: '0.00', color: '#FFA409' },
  { symbol: 'FIL', name: 'Filecoin', available: '0.000000', value: '0.00', color: '#0090FF' },
])

const fetchWallet = async () => {
  const token = localStorage.getItem('nt_token')
  if (!token) return

  try {
    const res = await fetch(`${API_BASE_URL}/api/wallet`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.success) {
      totalBalance.value = data.data.totalUSD
      
      const walletMap = {}
      if (data.data.wallets) {
        data.data.wallets.forEach(w => {
          if (w.account === 'spot') walletMap[w.coin] = w
        })
      }
      
      // Update coins with real balance
      walletCoins.value = walletCoins.value.map(c => {
        const w = walletMap[c.symbol]
        // Note: For value, we ideally need live prices. For now using static or if backend provides it.
        // The backend calculates totalUSD but doesn't return per-coin price in wallet endpoint directly unless we enhanced it.
        // We will just use the balance for now.
        return {
          ...c,
          available: w ? w.available : 0,
          value: w ? (w.available * 1).toFixed(2) : '0.00' // Placeholder for value calculation
        }
      })
    }
  } catch (err) {
    console.error('Failed to fetch wallet', err)
  }
}

onMounted(fetchWallet)
</script>

<style scoped>
.assets-page { background: var(--bg); }

.assets-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  padding-top: calc(var(--safe-top) + 12px);
  background: var(--bg-card);
}

.assets-header__title {
  font-size: 18px;
  font-weight: 700;
}

.header-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.balance-card {
  margin: 12px 16px;
  padding: 24px 20px;
  background: var(--gradient-header);
  border-radius: var(--radius-lg);
  color: white;
}

.balance-card__label { font-size: 13px; opacity: 0.8; }

.balance-card__amount {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 28px;
  font-family: var(--font-heading);
  font-weight: 700;
  margin: 8px 0 4px;
}

.eye-btn { padding: 4px; }

.balance-card__btc { font-size: 13px; opacity: 0.7; }

.balance-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.15);
}

.balance-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: white;
  font-size: 11px;
  font-weight: 500;
  text-decoration: none;
}

.balance-action-btn:active { opacity: 0.7; }

.assets-list { padding: 0 16px; }

.assets-list-header {
  display: flex;
  justify-content: space-between;
  padding: 12px 0 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.assets-list-header span { flex: 1; }
.assets-list-header span:nth-child(2) { text-align: center; }
.assets-list-header span:last-child { text-align: right; }

.asset-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
}

.asset-row__left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}
</style>
