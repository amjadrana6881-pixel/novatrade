<template>
  <div class="page">
    <div class="page-header">
      <button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
      <span class="page-header__title">Staking Plans</span>
      <span style="width:32px"></span>
    </div>

    <!-- Staking Banner -->
    <div class="staking-banner">
      <div class="staking-banner__icon">📈</div>
      <h2>Staking Plans</h2>
      <p>Earn fixed returns by staking your assets</p>
      <div class="balance-bar" v-if="balance !== null">
        <span>Available Balance:</span>
        <span class="balance-amount">{{ balance.toFixed(2) }} USDT</span>
      </div>
    </div>

    <!-- Plan Cards -->
    <div class="page-content">
      <div v-if="loading" class="empty-state" style="padding:40px;"><div class="spinner-lg"></div></div>
      
      <div v-else v-for="plan in plans" :key="plan.id" class="plan-card" :class="{disabled: !canAfford(plan)}">
        <div class="plan-card__header">
          <div class="plan-icon" :style="{background: getColor(plan)}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </div>
          <div>
            <h3>{{ plan.name }}</h3>
            <span class="badge badge-green" v-if="canAfford(plan)">Available</span>
            <span class="badge badge-red" v-else>Need {{ (plan.price - balance).toFixed(2) }} more USDT</span>
          </div>
        </div>
        <div class="plan-stats">
          <div class="plan-stat">
            <span class="plan-stat__label">Stake Amount</span>
            <span class="plan-stat__value">{{ plan.price }} USDT</span>
          </div>
          <div class="plan-stat">
            <span class="plan-stat__label">Fixed Return</span>
            <span class="plan-stat__value text-green">{{ plan.fixedProfit || (plan.price * plan.dailyReturn * plan.period / 100).toFixed(2) }} USDT</span>
          </div>
          <div class="plan-stat">
            <span class="plan-stat__label">Lock Period</span>
            <span class="plan-stat__value">{{ plan.period }} Days</span>
          </div>
        </div>
        <div class="plan-total">
          Total Payout: <strong class="text-green">{{ (plan.price + (plan.fixedProfit || plan.price * plan.dailyReturn * plan.period / 100)).toFixed(2) }} USDT</strong>
        </div>
        <button class="btn btn-primary btn-sm stake-btn" :disabled="!canAfford(plan) || purchasing === plan.id" @click="stakePlan(plan)">
          <span v-if="purchasing === plan.id">Processing...</span>
          <span v-else-if="!canAfford(plan)">Insufficient Balance</span>
          <span v-else>Start Staking</span>
        </button>
      </div>

      <!-- My Active Plans -->
      <div v-if="orders.length > 0" class="orders-section">
        <h3 class="section-title">My Active Plans</h3>
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <span class="fw-600">{{ order.robot?.name || 'Plan' }}</span>
            <span class="badge" :class="'badge-' + (order.status === 'running' ? 'green' : order.status === 'completed' ? 'blue' : 'red')">{{ order.status === 'running' ? 'Active' : order.status }}</span>
          </div>
          <div class="order-details">
            <div><span class="text-muted">Staked:</span> {{ order.amount }} USDT</div>
            <div><span class="text-muted">Earned:</span> <span class="text-green">{{ order.earned }} USDT</span></div>
            <div><span class="text-muted">Matures:</span> {{ new Date(order.endDate).toLocaleDateString() }}</div>
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

const plans = ref([])
const orders = ref([])
const balance = ref(0)
const loading = ref(true)
const purchasing = ref(null)

const colors = ['#2563EB', '#7C3AED', '#00C087', '#F7931A', '#E84142', '#627EEA', '#F3BA2F', '#9945FF']

const getColor = (plan) => {
  const idx = plans.value.indexOf(plan)
  return colors[idx % colors.length]
}

const canAfford = (plan) => balance.value >= plan.price

const fetchPlans = async () => {
  try {
    const res = await fetch(`${API}/robot`).then(r => r.json())
    if (res.success) plans.value = res.data
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

const stakePlan = async (plan) => {
  if (!canAfford(plan) || purchasing.value) return
  purchasing.value = plan.id
  try {
    const res = await fetch(`${API}/robot/purchase`, { method: 'POST', headers, body: JSON.stringify({ robotId: plan.id }) }).then(r => r.json())
    if (res.success) {
      alert(res.message)
      fetchBalance()
      fetchOrders()
    } else {
      alert(res.message || 'Failed to start staking')
    }
  } catch (err) { alert('Server error') }
  purchasing.value = null
}

onMounted(async () => {
  await Promise.all([fetchPlans(), fetchBalance(), fetchOrders()])
  loading.value = false
})
</script>

<style scoped>
.staking-banner {
  margin: 12px 16px;
  padding: 24px 20px;
  background: linear-gradient(135deg, #1e3a5f, #2563EB);
  border-radius: var(--radius-lg);
  color: white;
  position: relative;
  overflow: hidden;
}
.staking-banner::after {
  content: '';
  position: absolute;
  top: -30px;
  right: -30px;
  width: 120px;
  height: 120px;
  background: rgba(255,255,255,0.06);
  border-radius: 50%;
}
.staking-banner__icon { font-size: 32px; margin-bottom: 8px; }
.staking-banner h2 { font-size: 20px; margin-bottom: 4px; }
.staking-banner p { opacity: 0.8; font-size: 13px; margin-bottom: 12px; }
.balance-bar { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.12); padding: 8px 14px; border-radius: 8px; font-size: 13px; backdrop-filter: blur(6px); }
.balance-amount { font-weight: 700; font-size: 15px; }

.plan-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid var(--border-light);
  transition: all 0.25s ease;
}
.plan-card:hover { border-color: #2563EB30; box-shadow: 0 4px 16px rgba(37,99,235,0.08); }
.plan-card.disabled { opacity: 0.6; }
.plan-card__header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.plan-card__header h3 { font-size: 15px; font-weight: 600; }
.plan-icon { width: 40px; height: 40px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
.plan-stats { display: flex; justify-content: space-between; }
.plan-stat { text-align: center; }
.plan-stat__label { display: block; font-size: 11px; color: var(--text-muted); margin-bottom: 2px; }
.plan-stat__value { font-size: 14px; font-weight: 600; }
.plan-total { margin-top: 10px; padding: 8px 12px; background: var(--bg-hover, #F4F6FA); border-radius: 8px; font-size: 13px; text-align: center; }
.stake-btn { margin-top: 12px; width: 100%; padding: 10px; font-size: 14px; }
.stake-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.badge-red { background: #FFF1F3; color: #FF4D6A; }
.badge-blue { background: #E8F0FF; color: #2563EB; }

.orders-section { margin-top: 24px; }
.section-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
.order-card { background: var(--bg-card); border-radius: var(--radius-lg); padding: 14px; margin-bottom: 10px; border: 1px solid var(--border-light); }
.order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.order-details { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }

.fw-600 { font-weight: 600; }
.text-muted { color: var(--text-muted, #9CA3AF); }

.spinner-lg { width: 28px; height: 28px; border: 3px solid var(--border, #E8ECF2); border-top-color: var(--primary, #2563EB); border-radius: 50%; animation: spin 0.6s linear infinite; margin: 0 auto; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
