<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Trade History</span><span style="width:32px"></span></div>
    <div class="tabs"><button v-for="t in ['Open Orders','History','Trades']" :key="t" class="tab" :class="{active:tab===t}" @click="tab=t" style="font-size:13px;">{{t}}</button></div>
    <div v-if="orders.length===0" class="empty-state"><div class="empty-state__icon">📊</div><div class="empty-state__text">No {{ tab.toLowerCase() }} yet</div></div>
    <div v-else class="page-content">
      <div v-for="order in orders" :key="order.id" class="card mb-12">
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center gap-8"><span class="fw-600 fs-14">{{ order.pair }}</span><span class="badge" :class="order.side==='Buy'?'badge-green':'badge-red'">{{ order.side }}</span></div>
          <span class="fs-11 text-muted">{{ order.time }}</span></div>
        <div class="flex justify-between fs-13 mb-4"><span class="text-muted">Price</span><span>{{ order.price }}</span></div>
        <div class="flex justify-between fs-13 mb-4"><span class="text-muted">Amount</span><span>{{ order.amount }}</span></div>
        <div class="flex justify-between fs-13"><span class="text-muted">Status</span><span class="badge" :class="order.status==='Filled'?'badge-green':'badge-blue'">{{ order.status }}</span></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const tab = ref('Open Orders')
const orders = ref([])
</script>
