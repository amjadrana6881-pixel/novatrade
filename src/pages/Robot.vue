<template>
  <div class="page">
    <div class="page-header">
      <button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
      <span class="page-header__title">AI Quant Robot</span>
      <span style="width:32px"></span>
    </div>

    <!-- Robot Card Banner -->
    <div class="robot-banner">
      <h2>🤖 Smart Trading Robot</h2>
      <p>Automated profit generation — 3 day cycle</p>
      <div class="balance-bar" v-if="balance !== null">
        <span>Your Balance:</span>
        <span class="balance-amount">{{ balance.toFixed(2) }} USDT</span>
      </div>
    </div>

    <!-- Robot Cards -->
    <div class="page-content">
      <div v-if="loading" class="empty-state" style="padding:40px;"><div class="spinner-lg"></div></div>
      
      <div v-else v-for="robot in robots" :key="robot.id" class="robot-card" :class="{disabled: !canAfford(robot)}">
        <div class="robot-card__header">
          <div class="robot-icon" :style="{background: getColor(robot)}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="10" r="1.5"/><circle cx="15" cy="10" r="1.5"/><path d="M9 15h6" stroke="white" stroke-width="1.5" fill="none"/></svg>
          </div>
          <div>
            <h3>{{ robot.name }}</h3>
            <span class="badge badge-green" v-if="canAfford(robot)">Available</span>
            <span class="badge badge-red" v-else>Need {{ (robot.price - balance).toFixed(2) }} more USDT</span>
          </div>
        </div>
        <div class="robot-stats">
          <div class="robot-stat">
            <span class="robot-stat__label">Cost</span>
            <span class="robot-stat__value">{{ robot.price }} USDT</span>
          </div>
          <div class="robot-stat">
            <span class="robot-stat__label">Fixed Profit</span>
            <span class="robot-stat__value text-green">{{ robot.fixedProfit || (robot.price * robot.dailyReturn * robot.period / 100).toFixed(2) }} USDT</span>
          </div>
          <div class="robot-stat">
            <span class="robot-stat__label">Period</span>
            <span class="robot-stat__value">{{ robot.period }} Days</span>
          </div>
        </div>
        <div class="robot-total">
          Total Return: <strong class="text-green">{{ (robot.price + (robot.fixedProfit || robot.price * robot.dailyReturn * robot.period / 100)).toFixed(2) }} USDT</strong>
        </div>
        <button class="btn btn-primary btn-sm purchase-btn" :disabled="!canAfford(robot) || purchasing === robot.id" @click="purchaseRobot(robot)">
          <span v-if="purchasing === robot.id">Processing...</span>
          <span v-else-if="!canAfford(robot)">Insufficient Balance</span>
          <span v-else>Purchase Robot</span>
        </button>
      </div>

      <!-- My Active Orders -->
      <div v-if="orders.length > 0" class="orders-section">
        <h3 class="section-title">My Active Robots</h3>
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <span class="fw-600">{{ order.robot?.name || 'Robot' }}</span>
            <span class="badge" :class="'badge-' + (order.status === 'running' ? 'green' : order.status === 'completed' ? 'blue' : 'red')">{{ order.status }}</span>
          </div>
          <div class="order-details">
            <div><span class="text-muted">Invested:</span> {{ order.amount }} USDT</div>
            <div><span class="text-muted">Earned:</span> <span class="text-green">{{ order.earned }} USDT</span></div>
            <div><span class="text-muted">Ends:</span> {{ new Date(order.endDate).toLocaleDateString() }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import API_BASE_URL from '../config/api.js'

const API = `${API_BASE_URL}/api`
const token = localStorage.getItem('nt_token')
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

const robots = ref([])
const orders = ref([])
const balance = ref(0)
const loading = ref(true)
const purchasing = ref(null)

const colors = ['#1A6CFF', '#7C3AED', '#00C087', '#F7931A', '#E84142', '#627EEA', '#F3BA2F', '#9945FF']

const getColor = (robot) => {
  const idx = robots.value.indexOf(robot)
  return colors[idx % colors.length]
}

const canAfford = (robot) => balance.value >= robot.price

const fetchRobots = async () => {
  try {
    const res = await fetch(`${API}/robot`).then(r => r.json())
    if (res.success) robots.value = res.data
  } catch (err) { console.error(err) }
}

const fetchBalance = async () => {
  try {
    const res = await fetch(`${API}/wallet`, { headers }).then(r => r.json())
    if (res.success && res.data.wallets) {
      const usdtWallet = res.data.wallets.find(w => w.coin === 'USDT' && w.account === 'spot')
      balance.value = usdtWallet ? usdtWallet.available : 0
    }
  } catch (err) { balance.value = 0 }
}

const fetchOrders = async () => {
  try {
    const res = await fetch(`${API}/robot/orders`, { headers }).then(r => r.json())
    if (res.success) orders.value = res.data
  } catch (err) { console.error(err) }
}

const purchaseRobot = async (robot) => {
  if (!canAfford(robot) || purchasing.value) return
  purchasing.value = robot.id
  try {
    const res = await fetch(`${API}/robot/purchase`, { method: 'POST', headers, body: JSON.stringify({ robotId: robot.id }) }).then(r => r.json())
    if (res.success) {
      alert(res.message)
      fetchBalance()
      fetchOrders()
    } else {
      alert(res.message || 'Purchase failed')
    }
  } catch (err) { alert('Server error') }
  purchasing.value = null
}

onMounted(async () => {
  await Promise.all([fetchRobots(), fetchBalance(), fetchOrders()])
  loading.value = false
})
</script>

<style scoped>
.robot-banner {
  margin: 12px 16px;
  padding: 24px 20px;
  background: linear-gradient(135deg, #7C3AED, #A855F7);
  border-radius: var(--radius-lg);
  color: white;
}
.robot-banner h2 { font-size: 20px; margin-bottom: 4px; }
.robot-banner p { opacity: 0.8; font-size: 13px; margin-bottom: 12px; }
.balance-bar { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.15); padding: 8px 14px; border-radius: 8px; font-size: 13px; }
.balance-amount { font-weight: 700; font-size: 15px; }

.robot-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid var(--border-light);
  transition: opacity 0.2s;
}
.robot-card.disabled { opacity: 0.6; }
.robot-card__header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.robot-card__header h3 { font-size: 15px; font-weight: 600; }
.robot-icon { width: 40px; height: 40px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
.robot-stats { display: flex; justify-content: space-between; }
.robot-stat { text-align: center; }
.robot-stat__label { display: block; font-size: 11px; color: var(--text-muted); margin-bottom: 2px; }
.robot-stat__value { font-size: 14px; font-weight: 600; }
.robot-total { margin-top: 10px; padding: 8px 12px; background: var(--bg-hover, #F4F6FA); border-radius: 8px; font-size: 13px; text-align: center; }
.purchase-btn { margin-top: 12px; width: 100%; padding: 10px; font-size: 14px; }
.purchase-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.badge-red { background: #FFF1F3; color: #FF4D6A; }
.badge-blue { background: #E8F0FF; color: #1A6CFF; }

.orders-section { margin-top: 24px; }
.section-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
.order-card { background: var(--bg-card); border-radius: var(--radius-lg); padding: 14px; margin-bottom: 10px; border: 1px solid var(--border-light); }
.order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.order-details { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }

.fw-600 { font-weight: 600; }
.text-muted { color: var(--text-muted, #9CA3AF); }

.spinner-lg { width: 28px; height: 28px; border: 3px solid var(--border, #E8ECF2); border-top-color: var(--primary, #1A6CFF); border-radius: 50%; animation: spin 0.6s linear infinite; margin: 0 auto; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
