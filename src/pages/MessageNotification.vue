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
import { ref, computed, onMounted } from 'vue'

const tab = ref('All')
const messages = ref([])

const fetchMessages = async () => {
    const token = localStorage.getItem('nt_token')
    if(!token) return
    try {
        const res = await fetch('http://localhost:3001/api/notification', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success) {
            // Flatten the notification object structure if needed, but assuming API returns array
            // The API returns { notifications: [], unreadCount: 0 } inside data
            messages.value = data.data.notifications.map(m => ({
                id: m.id,
                type: m.type === 'system' ? 'System' : 'Transaction', // Map backend type to frontend labels
                title: m.title,
                content: m.content,
                time: new Date(m.createdAt).toLocaleDateString()
            }))
        }
    } catch(e) { console.error(e) }
}

const filteredMessages = computed(() => {
    if (tab.value === 'All') return messages.value
    return messages.value.filter(m => m.type === tab.value)
})

onMounted(fetchMessages)
</script>
