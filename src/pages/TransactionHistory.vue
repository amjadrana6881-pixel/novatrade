<template>
  <div class="page">
    <div class="page-header sticky-header">
      <button class="page-header__back" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <span class="page-header__title">History</span>
      <button class="header-action" @click="fetchData">
        <svg :class="{ 'spin': loading }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
      </button>
    </div>

    <div class="page-content">
      <div class="tabs-container mb-16">
        <button class="tab-btn" :class="{ active: activeTab === 'deposit' }" @click="activeTab = 'deposit'">Deposits</button>
        <button class="tab-btn" :class="{ active: activeTab === 'withdraw' }" @click="activeTab = 'withdraw'">Withdrawals</button>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="shimmer item-shimmer" v-for="i in 5" :key="i"></div>
      </div>

      <div v-else-if="currentList.length === 0" class="empty-state">
        <div class="empty-icon">📂</div>
        <p>No transactions found</p>
      </div>

      <div v-else class="transaction-list">
        <div v-for="item in currentList" :key="item.id" class="trx-card">
          <div class="trx-card__main">
            <div class="trx-type">
              <span class="type-icon" :class="activeTab">
                <svg v-if="activeTab==='deposit'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              </span>
              <div>
                <div class="fw-600 fs-15">{{ item.amount }} {{ item.coin }}</div>
                <div class="fs-12 text-muted">{{ item.network }}</div>
              </div>
            </div>
            <div class="trx-status">
              <span class="status-badge" :class="item.status">{{ item.status }}</span>
              <div class="fs-11 text-muted mt-4">{{ formatDate(item.createdAt) }}</div>
            </div>
          </div>
          <div v-if="item.txHash" class="trx-card__footer">
            <span class="fs-11 text-muted">TXID: {{ truncate(item.txHash) }}</span>
            <button class="copy-btn" @click="copy(item.txHash)">Copy</button>
          </div>
          <div v-if="item.reviewNote" class="trx-card__note">
            <span class="fs-11 text-danger">Note: {{ item.reviewNote }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import API_BASE_URL from '../config/api.js'

const activeTab = ref('deposit')
const loading = ref(false)
const deposits = ref([])
const withdrawals = ref([])

const currentList = computed(() => {
  return activeTab.value === 'deposit' ? deposits.value : withdrawals.value
})

const fetchData = async () => {
  const token = localStorage.getItem('nt_token')
  if (!token) return

  loading.value = true
  try {
    const [depRes, withRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/deposit`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/withdraw`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json())
    ])

    if (depRes.success) deposits.value = depRes.data
    if (withRes.success) withdrawals.value = withRes.data
  } catch (err) {
    console.error('Failed to fetch history', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const truncate = (str) => str ? str.slice(0, 8) + '...' + str.slice(-8) : ''

const copy = (text) => {
  navigator.clipboard.writeText(text)
  alert('TXID copied!')
}

onMounted(fetchData)
</script>

<style scoped>
.sticky-header { position: sticky; top: 0; z-index: 100; background: var(--bg-card); }
.header-action { padding: 8px; color: var(--text-secondary); background: none; border: none; cursor: pointer; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.tabs-container { display: flex; background: var(--bg-card); border-radius: 12px; padding: 4px; border: 1px solid var(--border-light); }
.tab-btn { flex: 1; padding: 10px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; background: transparent; color: var(--text-secondary); cursor: pointer; transition: 0.2s; }
.tab-btn.active { background: var(--primary); color: white; box-shadow: var(--shadow-sm); }

.trx-card { background: var(--bg-card); border-radius: 12px; padding: 16px; margin-bottom: 12px; border: 1px solid var(--border-light); }
.trx-card__main { display: flex; justify-content: space-between; align-items: flex-start; }
.trx-type { display: flex; gap: 12px; align-items: center; }
.type-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.type-icon.deposit { background: rgba(0, 192, 135, 0.1); color: #00C087; }
.type-icon.withdraw { background: rgba(255, 77, 106, 0.1); color: #FF4D6A; }

.status-badge { font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 600; text-transform: capitalize; }
.status-badge.pending { background: #FFF8ED; color: #FFB84D; }
.status-badge.approved { background: #E6F9F1; color: #00C087; }
.status-badge.rejected { background: #FFF1F3; color: #FF4D6A; }

.trx-card__footer { margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--border-light); display: flex; justify-content: space-between; align-items: center; }
.copy-btn { padding: 4px 8px; font-size: 11px; color: var(--primary); background: none; border: none; font-weight: 600; cursor: pointer; }
.trx-card__note { margin-top: 8px; padding: 8px; background: rgba(255, 77, 106, 0.05); border-radius: 6px; }

.loading-state { padding: 20px 0; }
.item-shimmer { height: 80px; margin-bottom: 12px; border-radius: 12px; }
.empty-state { padding: 60px 0; text-align: center; color: var(--text-muted); }
.empty-icon { font-size: 40px; margin-bottom: 12px; }

.fw-600 { font-weight: 600; }
.fs-15 { font-size: 15px; }
.fs-12 { font-size: 12px; }
.fs-11 { font-size: 11px; }
.mb-16 { margin-bottom: 16px; }
.mt-4 { margin-top: 4px; }
.text-danger { color: #FF4D6A; }
</style>
