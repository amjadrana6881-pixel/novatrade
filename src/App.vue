<template>
  <router-view />
  
  <!-- Global Real-time Toast -->
  <Transition name="toast">
    <div v-if="notification" class="realtime-toast" :class="notification.type">
      <div class="toast-icon">
        <span v-if="notification.type === 'transaction'">💰</span>
        <span v-else-if="notification.type === 'system'">🔔</span>
        <span v-else>🛡️</span>
      </div>
      <div class="toast-content">
        <div class="toast-title">{{ notification.title }}</div>
        <div class="toast-message">{{ notification.content }}</div>
      </div>
      <button class="toast-close" @click="notification = null">×</button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import API_BASE_URL from './config/api.js'

const notification = ref(null)
const socket = ref(null)

const connectSocket = () => {
  const user = JSON.parse(localStorage.getItem('nt_user') || '{}')
  const userId = user.id

  // Connect with userId for private notifications
  socket.value = io(API_BASE_URL, {
    query: { userId }
  })

  socket.value.on('notification', (data) => {
    console.log('Real-time notification received:', data)
    notification.value = data
    
    // Auto hide after 8 seconds
    setTimeout(() => {
      if (notification.value === data) notification.value = null
    }, 8000)
  })
}

onMounted(() => {
  connectSocket()
  
  // Reconnect when user logs in (just in case they logged in after App mounted)
  window.addEventListener('storage', (e) => {
    if (e.key === 'nt_token' && e.newValue) {
      if (socket.value) socket.value.disconnect()
      connectSocket()
    }
  })
})

onUnmounted(() => {
  if (socket.value) socket.value.disconnect()
})
</script>

<style>
.realtime-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  left: 20px;
  max-width: 400px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;
  z-index: 9999;
  border-left: 4px solid var(--primary);
}

.realtime-toast.transaction { border-left-color: #00C087; }
.realtime-toast.system { border-left-color: #1A6CFF; }

.toast-icon {
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.toast-content { flex: 1; }
.toast-title { font-weight: 700; font-size: 14px; margin-bottom: 2px; }
.toast-message { font-size: 13px; color: #6b7280; line-height: 1.4; }

.toast-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
}

/* Transitions */
.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from { opacity: 0; transform: translateY(-40px); }
.toast-leave-to { opacity: 0; transform: translateX(40px); }
</style>
