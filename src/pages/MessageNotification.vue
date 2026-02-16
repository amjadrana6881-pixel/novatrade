<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Message Notification</span><span style="width:32px"></span></div>
    <div class="tabs"><button v-for="t in ['All','System','Transaction']" :key="t" class="tab" :class="{active:tab===t}" @click="tab=t">{{t}}</button></div>
    <div v-if="messages.length===0" class="empty-state"><div class="empty-state__icon">📭</div><div class="empty-state__text">No messages yet</div></div>
    <div v-else class="page-content">
      <div v-for="msg in filteredMessages" :key="msg.id" class="card mb-12">
        <div class="flex justify-between items-center mb-8">
          <span class="badge" :class="msg.type==='System'?'badge-blue':'badge-green'">{{ msg.type }}</span>
          <span class="fs-11 text-muted">{{ msg.time }}</span>
        </div>
        <h4 class="fs-14 fw-600">{{ msg.title }}</h4>
        <p class="fs-13 text-secondary mt-4">{{ msg.content }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const tab = ref('All')
const messages = ref([
  { id: 1, type: 'System', title: 'Welcome to NovaTrade', content: 'Your account has been created. Complete KYC to unlock all features.', time: '2026-02-15' },
  { id: 2, type: 'System', title: 'Security Reminder', content: 'Please set your transaction password for secure withdrawals.', time: '2026-02-15' },
])
const filteredMessages = computed(() => tab.value === 'All' ? messages.value : messages.value.filter(m => m.type === tab.value))
</script>
