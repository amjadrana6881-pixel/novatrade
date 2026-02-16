<template>
  <div class="page exchange-page">
    <!-- Header -->
    <div class="exchange-header">
      <div class="pair-selector" @click="showPairs = !showPairs">
        <span class="pair-name">{{ currentPair }}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="pair-price" :class="priceUp ? 'text-green' : 'text-red'">${{ formatPrice(currentPrice) }}</div>
      <div class="pair-change" :class="priceUp ? 'text-green' : 'text-red'">{{ priceUp ? '+' : '' }}{{ change24h }}%</div>
    </div>

    <!-- Chart Placeholder -->
    <div class="chart-area">
      <div class="chart-tabs">
        <button v-for="t in ['1m','5m','15m','1H','4H','1D']" :key="t" class="chart-tab" :class="{ active: chartTf === t }" @click="chartTf = t">{{ t }}</button>
      </div>
      <div class="chart-placeholder">
        <svg width="100%" height="120" viewBox="0 0 400 120" preserveAspectRatio="none">
          <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00C087" stop-opacity="0.3"/><stop offset="1" stop-color="#00C087" stop-opacity="0"/></linearGradient></defs>
          <path :d="chartPath" fill="url(#cg)"/>
          <path :d="chartLine" fill="none" stroke="#00C087" stroke-width="2"/>
        </svg>
      </div>
    </div>

    <!-- Order Book -->
    <div class="orderbook">
      <div class="orderbook-header">
        <span>Price(USDT)</span>
        <span>Amount({{ baseCoin }})</span>
      </div>
      <!-- Asks (red) -->
      <div v-for="(ask, i) in asks" :key="'a'+i" class="orderbook-row ask">
        <div class="ob-bar" :style="{ width: ask.pct + '%' }"></div>
        <span class="text-red">{{ formatPrice(ask.price) }}</span>
        <span>{{ ask.amount.toFixed(4) }}</span>
      </div>
      <!-- Current Price -->
      <div class="current-price-row">
        <span :class="priceUp ? 'text-green' : 'text-red'">${{ formatPrice(currentPrice) }}</span>
      </div>
      <!-- Bids (green) -->
      <div v-for="(bid, i) in bids" :key="'b'+i" class="orderbook-row bid">
        <div class="ob-bar bid-bar" :style="{ width: bid.pct + '%' }"></div>
        <span class="text-green">{{ formatPrice(bid.price) }}</span>
        <span>{{ bid.amount.toFixed(4) }}</span>
      </div>
    </div>

    <!-- Buy/Sell Section -->
    <div class="trade-section">
      <div class="pill-tabs" style="margin-bottom:12px;">
        <button class="pill-tab" :class="{ active: side === 'buy' }" @click="side = 'buy'" style="background:var(--accent);color:white;" v-if="side==='buy'">Buy</button>
        <button class="pill-tab" :class="{ active: side === 'buy' }" @click="side = 'buy'" v-else>Buy</button>
        <button class="pill-tab" :class="{ active: side === 'sell' }" @click="side = 'sell'" style="background:var(--danger);color:white;" v-if="side==='sell'">Sell</button>
        <button class="pill-tab" :class="{ active: side === 'sell' }" @click="side = 'sell'" v-else>Sell</button>
      </div>

      <div class="trade-type">
        <button v-for="t in ['Limit', 'Market']" :key="t" class="trade-type-btn" :class="{ active: orderType === t }" @click="orderType = t">{{ t }}</button>
      </div>

      <div class="input-group" style="margin-top:12px;">
        <label>Price (USDT)</label>
        <input v-model="orderPrice" type="number" class="input-field" :placeholder="orderType === 'Market' ? 'Market Price' : 'Enter price'" :disabled="orderType === 'Market'" />
      </div>

      <div class="input-group">
        <label>Amount ({{ baseCoin }})</label>
        <input v-model="orderAmount" type="number" class="input-field" placeholder="Enter amount" />
      </div>

      <div class="pct-buttons">
        <button v-for="p in [25, 50, 75, 100]" :key="p" class="pct-btn" @click="setPercent(p)">{{ p }}%</button>
      </div>

      <div class="trade-total">
        <span>Total</span>
        <span>{{ (parseFloat(orderPrice || 0) * parseFloat(orderAmount || 0)).toFixed(2) }} USDT</span>
      </div>

      <div class="trade-balance">
        <span>Available</span>
        <span>0.00 {{ side === 'buy' ? 'USDT' : baseCoin }}</span>
      </div>

      <button class="btn" :class="side === 'buy' ? 'btn-buy' : 'btn-sell'" style="margin-top:12px;">
        {{ side === 'buy' ? 'Buy' : 'Sell' }} {{ baseCoin }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const currentPair = ref('BTC/USDT')
const baseCoin = computed(() => currentPair.value.split('/')[0])
const currentPrice = ref(96500)
const change24h = ref('2.34')
const priceUp = ref(true)
const chartTf = ref('1H')
const side = ref('buy')
const orderType = ref('Limit')
const orderPrice = ref('')
const orderAmount = ref('')
const showPairs = ref(false)

// Generate mock chart data
const chartPoints = ref([])
onMounted(() => {
  const pts = []
  let price = 95000
  for (let i = 0; i < 50; i++) {
    price += (Math.random() - 0.45) * 500
    pts.push({ x: (i / 49) * 400, y: 120 - ((price - 94000) / 4000) * 100 })
  }
  chartPoints.value = pts
  currentPrice.value = Math.round(price)
})

const chartLine = computed(() => {
  if (!chartPoints.value.length) return ''
  return chartPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
})

const chartPath = computed(() => {
  if (!chartPoints.value.length) return ''
  return chartLine.value + ` L400,120 L0,120 Z`
})

// Mock order book 
const asks = ref(Array.from({ length: 5 }, (_, i) => ({
  price: 96500 + (5 - i) * 50 + Math.random() * 20,
  amount: Math.random() * 2 + 0.1,
  pct: 30 + Math.random() * 60
}))).value

const bids = ref(Array.from({ length: 5 }, (_, i) => ({
  price: 96500 - (i + 1) * 50 - Math.random() * 20,
  amount: Math.random() * 2 + 0.1,
  pct: 30 + Math.random() * 60
}))).value

const formatPrice = (p) => {
  if (!p) return '0'
  return p >= 1000 ? p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : p.toFixed(2)
}

const setPercent = (p) => { /* TODO */ }
</script>

<style scoped>
.exchange-page { background: var(--bg-card); }

.exchange-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  padding-top: calc(var(--safe-top) + 12px);
  border-bottom: 1px solid var(--border-light);
}

.pair-selector {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.pair-name { font-family: var(--font-heading); font-weight: 700; font-size: 17px; }
.pair-price { font-weight: 700; font-size: 16px; }
.pair-change { font-size: 13px; font-weight: 600; }

.chart-area { border-bottom: 1px solid var(--border-light); }

.chart-tabs {
  display: flex;
  gap: 0;
  padding: 8px 16px;
}

.chart-tab {
  padding: 4px 10px;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
  border-radius: 4px;
}

.chart-tab.active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}

.chart-placeholder {
  padding: 0 16px 8px;
  height: 130px;
}

/* Order Book */
.orderbook { padding: 8px 16px; border-bottom: 1px solid var(--border-light); }

.orderbook-header {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.orderbook-row {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
  font-size: 12px;
  position: relative;
  font-family: 'Inter', monospace;
}

.ob-bar {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(245, 69, 92, 0.08);
  z-index: 0;
}

.ob-bar.bid-bar { background: rgba(0, 192, 135, 0.08); }

.orderbook-row span { position: relative; z-index: 1; }

.current-price-row {
  text-align: center;
  padding: 6px 0;
  font-size: 16px;
  font-weight: 700;
}

/* Trade Section */
.trade-section { padding: 12px 16px; }

.trade-type {
  display: flex;
  gap: 8px;
}

.trade-type-btn {
  padding: 6px 16px;
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}

.trade-type-btn.active {
  color: var(--text-primary);
  font-weight: 600;
  border-bottom: 2px solid var(--primary);
}

.pct-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.pct-btn {
  flex: 1;
  padding: 6px;
  background: var(--bg-input);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.trade-total, .trade-balance {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}
</style>
