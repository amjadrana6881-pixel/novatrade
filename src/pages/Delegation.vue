<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">My Delegation</span><span style="width:32px"></span></div>
    <div class="tabs"><button v-for="t in ['Running','Completed']" :key="t" class="tab" :class="{active:tab===t}" @click="tab=t">{{t}}</button></div>
    <div v-if="filteredOrders.length === 0" class="empty-state"><div class="empty-state__icon">📋</div><div class="empty-state__text">No {{ tab.toLowerCase() }} delegation records</div></div>
    <div v-else class="page-content">
      <div v-for="order in filteredOrders" :key="order.id" class="card mb-12">
        <div class="flex justify-between items-center mb-8">
            <span class="fw-600">{{ order.robot.name }}</span>
            <span class="badge" :class="order.status==='running'?'badge-green':'badge-gray'">{{ order.status }}</span>
        </div>
        <div class="grid grid-cols-2 gap-8 fs-12 text-secondary">
            <div>Invest: {{ order.amount }} USDT</div>
            <div>Profit: {{ order.status==='completed' ? order.earned : 'Running' }}</div>
            <div>Start: {{ new Date(order.startDate).toLocaleDateString() }}</div>
            <div>End: {{ new Date(order.endDate).toLocaleDateString() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import API_BASE_URL from '../config/api.js'

const tab = ref('Running')
const orders = ref([])

const fetchOrders = async () => {
  const token = localStorage.getItem('nt_token')
  if(!token) return
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/robot/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.success) orders.value = data.data
  } catch (err) { console.error(err) }
}

const filteredOrders = computed(() => {
  if (tab.value === 'Running') return orders.value.filter(o => o.status === 'running')
  return orders.value.filter(o => o.status === 'completed')
})

onMounted(fetchOrders)
</script>
