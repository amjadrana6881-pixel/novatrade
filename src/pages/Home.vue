<template>
  <div class="page home-page">
    <!-- Home Header -->
    <div class="home-header">
      <div class="home-header__left">
        <div class="logo-small">
          <img src="/logo.png" alt="NovaTrade" width="28" height="28" style="border-radius:6px;"/>
        </div>
        <span class="home-header__brand">NovaTrade</span>
      </div>
      <div class="home-header__right">
        <router-link to="/service" class="header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </router-link>
        <router-link to="/notice" class="header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span class="badge-dot"></span>
        </router-link>
      </div>
    </div>

    <!-- Banner Carousel -->
    <div class="banner-carousel">
      <div class="banner-track" :style="{ transform: `translateX(-${bannerIdx * 100}%)` }">
        <div v-for="(b, i) in banners" :key="i" class="banner-slide">
          <img v-if="b.imageUrl" :src="b.imageUrl.startsWith('http') ? b.imageUrl : `http://localhost:3001${b.imageUrl}`" :alt="b.title" class="banner-image"/>
          <div v-else class="banner-bg" :style="{ background: b.bg }"></div>
          <div class="banner-overlay">
            <h3>{{ b.title }}</h3>
            <p v-if="b.description">{{ b.description }}</p>
          </div>
        </div>
      </div>
      <div class="banner-dots">
        <span v-for="(_, i) in banners" :key="i" class="dot" :class="{ active: i === bannerIdx }" @click="bannerIdx = i"></span>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <router-link v-for="action in actions" :key="action.path" :to="action.path" class="quick-action">
        <div class="quick-action__icon" :style="{ background: action.bg }">
          <span v-html="action.icon"></span>
        </div>
        <span class="quick-action__label">{{ action.label }}</span>
      </router-link>
    </div>

    <!-- Notice Bar -->
    <div class="notice-bar" v-if="announcement">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--warning)" stroke="var(--warning)" stroke-width="0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-6h2v6h-2zm0-8V7h2v2h-2z"/></svg>
      <span class="notice-text">{{ announcement }}</span>
    </div>

    <!-- Market Section -->
    <div class="market-section">
      <div class="section-header">
        <h3>🔥 Top Movers</h3>
        <router-link to="/exchange" class="see-all">See All →</router-link>
      </div>

      <!-- Hot Coins Horizontal Scroll -->
      <div class="hot-coins-scroll">
        <div v-for="coin in hotCoins" :key="coin.symbol" class="hot-coin-card" @click="$router.push('/exchange')">
          <div class="hot-coin-header">
            <div class="coin-icon" :style="{ background: coin.color }">{{ coin.symbol.slice(0,2) }}</div>
            <span class="hot-coin-name">{{ coin.symbol }}</span>
          </div>
          <div class="hot-coin-price">${{ formatPrice(coin.price) }}</div>
          <div class="hot-coin-change" :class="coin.change >= 0 ? 'text-green' : 'text-red'">
            {{ coin.change >= 0 ? '+' : '' }}{{ coin.change.toFixed(2) }}%
          </div>
        </div>
      </div>

      <!-- Coin List -->
      <div class="section-header mt-16">
        <h3>📊 Market</h3>
        <div class="pill-tabs" style="width:auto;padding:2px;">
          <button v-for="t in ['USDT','BTC','ETH']" :key="t" class="pill-tab" :class="{ active: pairFilter === t }" @click="pairFilter = t" style="padding:4px 12px;font-size:11px;">{{ t }}</button>
        </div>
      </div>

      <div class="coin-list-header">
        <span>Name</span>
        <span>Price</span>
        <span>24h Change</span>
      </div>

      <div v-if="loadingPrices" class="empty-state" style="padding:24px;">
        <div class="spinner-lg"></div>
      </div>

      <div v-else class="coin-list">
        <div v-for="coin in filteredCoins" :key="coin.id" class="coin-row" @click="$router.push('/exchange')">
          <div class="coin-row__left">
            <div class="coin-icon" :style="{ background: coin.color || '#1A6CFF' }">{{ coin.symbol.slice(0,2).toUpperCase() }}</div>
            <div>
              <div class="coin-row__name">{{ coin.symbol.toUpperCase() }}</div>
              <div class="coin-row__sub">{{ coin.name }}</div>
            </div>
          </div>
          <div class="coin-row__price">${{ formatPrice(coin.current_price) }}</div>
          <div class="coin-row__change" :class="coin.price_change_percentage_24h >= 0 ? 'bg-green text-green' : 'bg-red text-red'">
            {{ coin.price_change_percentage_24h >= 0 ? '+' : '' }}{{ (coin.price_change_percentage_24h || 0).toFixed(2) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const bannerIdx = ref(0)
const pairFilter = ref('USDT')
const loadingPrices = ref(true)
const coins = ref([])

const announcement = ref('Welcome to NovaTrade – Your Trusted Crypto Exchange 🚀')

const defaultBanners = [
  { title: 'AI Quant Trading', description: 'Smart robots, auto profit 24/7', bg: 'linear-gradient(135deg, #1A3A8A, #1A6CFF)' },
  { title: '50 USDT Reward', description: 'Invite friends & earn trial fund', bg: 'linear-gradient(135deg, #00856F, #00C087)' },
  { title: 'VIP Upgrade', description: 'Higher level, higher returns', bg: 'linear-gradient(135deg, #7C3AED, #A855F7)' }
]

const banners = ref(defaultBanners)

const actions = [
  { label: 'Deposit', path: '/recharge', bg: '#E8F0FF', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A6CFF" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>' },
  { label: 'Withdraw', path: '/withdraw', bg: '#E6F9F3', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00C087" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>' },
  { label: 'AI Robot', path: '/ai', bg: '#F3E8FF', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/></svg>' },
  { label: 'Invite', path: '/invite', bg: '#FFF5EB', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF9F43" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>' },
]

const coinColors = {
  btc: '#F7931A', eth: '#627EEA', bnb: '#F3BA2F', xrp: '#23292F', sol: '#9945FF',
  ada: '#0033AD', doge: '#C2A633', dot: '#E6007A', avax: '#E84142', matic: '#8247E5',
  link: '#2A5ADA', uni: '#FF007A', ltc: '#345D9D', atom: '#2E3148', trx: '#FF0013'
}

const hotCoins = computed(() => {
  return [...coins.value].sort((a, b) => Math.abs(b.price_change_percentage_24h || 0) - Math.abs(a.price_change_percentage_24h || 0)).slice(0, 5).map(c => ({
    symbol: c.symbol.toUpperCase(),
    price: c.current_price,
    change: c.price_change_percentage_24h || 0,
    color: coinColors[c.symbol] || '#1A6CFF'
  }))
})

const filteredCoins = computed(() => {
  return coins.value.map(c => ({ ...c, color: coinColors[c.symbol] || '#1A6CFF' }))
})

const formatPrice = (p) => {
  if (!p) return '0.00'
  if (p >= 1000) return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (p >= 1) return p.toFixed(2)
  return p.toFixed(6)
}

const fetchPrices = async () => {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false')
    if (res.ok) {
      coins.value = await res.json()
    } else {
      useMockData()
    }
  } catch {
    useMockData()
  }
  loadingPrices.value = false
}

const useMockData = () => {
  coins.value = [
    { id:'bitcoin', symbol:'btc', name:'Bitcoin', current_price:96500, price_change_percentage_24h:2.34 },
    { id:'ethereum', symbol:'eth', name:'Ethereum', current_price:3250, price_change_percentage_24h:1.89 },
    { id:'binancecoin', symbol:'bnb', name:'BNB', current_price:620, price_change_percentage_24h:-0.45 },
    { id:'ripple', symbol:'xrp', name:'XRP', current_price:2.45, price_change_percentage_24h:5.12 },
    { id:'solana', symbol:'sol', name:'Solana', current_price:198, price_change_percentage_24h:3.67 },
    { id:'cardano', symbol:'ada', name:'Cardano', current_price:0.95, price_change_percentage_24h:-1.23 },
    { id:'dogecoin', symbol:'doge', name:'Dogecoin', current_price:0.32, price_change_percentage_24h:7.89 },
    { id:'polkadot', symbol:'dot', name:'Polkadot', current_price:7.50, price_change_percentage_24h:-2.15 },
    { id:'avalanche', symbol:'avax', name:'Avalanche', current_price:38.50, price_change_percentage_24h:4.56 },
    { id:'polygon', symbol:'matic', name:'Polygon', current_price:0.88, price_change_percentage_24h:1.34 },
    { id:'chainlink', symbol:'link', name:'Chainlink', current_price:18.90, price_change_percentage_24h:2.78 },
    { id:'uniswap', symbol:'uni', name:'Uniswap', current_price:12.30, price_change_percentage_24h:-0.89 },
    { id:'litecoin', symbol:'ltc', name:'Litecoin', current_price:95.60, price_change_percentage_24h:1.56 },
    { id:'cosmos', symbol:'atom', name:'Cosmos', current_price:9.80, price_change_percentage_24h:-3.21 },
    { id:'tron', symbol:'trx', name:'TRON', current_price:0.24, price_change_percentage_24h:0.45 },
  ]
}

// Fetch banners from API
const fetchBanners = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/banners')
    const data = await res.json()
    if (data.success && data.data.length > 0) {
      banners.value = data.data
    }
  } catch (err) {
    console.log('Using default banners')
  }
}

// Banner auto-rotate
let bannerTimer
onMounted(() => {
  fetchBanners()
  fetchPrices()
  bannerTimer = setInterval(() => {
    bannerIdx.value = (bannerIdx.value + 1) % banners.value.length
  }, 4000)
})
</script>

<style scoped>
.home-page { padding-bottom: calc(var(--nav-height) + var(--safe-bottom) + 16px); }

/* Header */
.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  padding-top: calc(var(--safe-top) + 12px);
  background: var(--bg-card);
}

.home-header__left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.home-header__brand {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 18px;
  color: var(--text-primary);
}

.home-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.badge-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 7px;
  height: 7px;
  background: var(--danger);
  border-radius: 50%;
  border: 1.5px solid white;
}

/* Banner */
.banner-carousel {
  margin: 12px 16px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
}

.banner-track {
  display: flex;
  transition: transform 0.5s ease;
}

.banner-slide {
  min-width: 100%;
  height: 140px;
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-bg {
  width: 100%;
  height: 100%;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.5));
}

.banner-overlay h3 {
  color: white;
  font-size: 18px;
  margin-bottom: 2px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.banner-overlay p {
  color: rgba(255,255,255,0.85);
  font-size: 13px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.banner-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  transition: var(--transition);
}

.dot.active {
  width: 18px;
  border-radius: 3px;
  background: white;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 8px 16px 16px;
}

.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
}

.quick-action__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.quick-action:active .quick-action__icon { transform: scale(0.92); }

.quick-action__label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
}

/* Notice */
.notice-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 16px 12px;
  padding: 10px 14px;
  background: var(--warning-light);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.notice-text {
  font-size: 12px;
  color: var(--warning);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Market */
.market-section { padding: 0 16px; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-header h3 {
  font-size: 16px;
  font-weight: 700;
}

.see-all {
  font-size: 13px;
  color: var(--primary);
  font-weight: 500;
}

/* Hot Coins Scroll */
.hot-coins-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
}

.hot-coins-scroll::-webkit-scrollbar { display: none; }

.hot-coin-card {
  min-width: 120px;
  padding: 12px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: var(--transition);
}

.hot-coin-card:active { transform: scale(0.97); }

.hot-coin-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.hot-coin-header .coin-icon { width: 24px; height: 24px; font-size: 9px; }
.hot-coin-name { font-weight: 600; font-size: 13px; }
.hot-coin-price { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
.hot-coin-change { font-size: 12px; font-weight: 600; }

/* Coin List */
.coin-list-header {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.coin-list-header span:first-child { flex: 1; }
.coin-list-header span:nth-child(2) { width: 90px; text-align: right; }
.coin-list-header span:last-child { width: 80px; text-align: right; }

.coin-row { cursor: pointer; padding: 10px 0; }
.coin-row:active { background: var(--bg-hover); margin: 0 -16px; padding: 10px 16px; border-radius: var(--radius-sm); }

.coin-row__price { width: 90px; text-align: right; }

.coin-row__change {
  width: 72px;
  text-align: center;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  margin-left: auto;
}

.spinner-lg {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 0 auto;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
