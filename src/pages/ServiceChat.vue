<template>
  <div class="page chat-page">
    <div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Service</span><span style="width:32px"></span></div>
    <div class="chat-messages" ref="chatContainer">
      <div v-for="msg in messages" :key="msg.id" class="chat-msg" :class="msg.from">
        <div v-if="msg.from==='bot'" class="bot-avatar"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="10" r="1.5"/><circle cx="15" cy="10" r="1.5"/><path d="M9 15h6" stroke="white" stroke-width="1.5" fill="none"/></svg></div>
        <div class="chat-bubble"><p>{{ msg.text }}</p><span class="chat-time">{{ msg.time }}</span></div>
      </div>
    </div>
    <div class="chat-input-bar">
      <input v-model="newMsg" class="chat-input" placeholder="Type a message..." @keyup.enter="sendMsg"/>
      <button class="chat-send" @click="sendMsg" :disabled="!newMsg.trim()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, nextTick } from 'vue'
const chatContainer = ref(null)
const newMsg = ref('')
const messages = ref([
  { id: 1, from: 'bot', text: 'Welcome to NovaTrade Support! 👋 How can I help you today?', time: 'Now' },
  { id: 2, from: 'bot', text: 'You can ask about: Deposits, Withdrawals, KYC, Robot Trading, VIP Upgrade, or any other questions.', time: 'Now' },
])
const sendMsg = async () => {
  if (!newMsg.value.trim()) return
  messages.value.push({ id: Date.now(), from: 'user', text: newMsg.value, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) })
  const userText = newMsg.value
  newMsg.value = ''
  await nextTick()
  chatContainer.value?.scrollTo(0, chatContainer.value.scrollHeight)
  setTimeout(() => {
    messages.value.push({ id: Date.now(), from: 'bot', text: `Thank you for your message. Our support team has received your inquiry about "${userText}". We will respond within 24 hours. For urgent matters, contact us at support@novatrade.com`, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) })
    nextTick(() => chatContainer.value?.scrollTo(0, chatContainer.value.scrollHeight))
  }, 1200)
}
</script>
<style scoped>
.chat-page{display:flex;flex-direction:column;height:100vh}
.chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.chat-msg{display:flex;gap:8px;max-width:85%}
.chat-msg.user{align-self:flex-end;flex-direction:row-reverse}
.bot-avatar{width:32px;height:32px;min-width:32px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center}
.chat-bubble{padding:10px 14px;border-radius:14px;font-size:14px;line-height:1.5}
.chat-msg.bot .chat-bubble{background:var(--bg-input);color:var(--text-primary);border-bottom-left-radius:4px}
.chat-msg.user .chat-bubble{background:var(--primary);color:white;border-bottom-right-radius:4px}
.chat-time{display:block;font-size:10px;opacity:0.6;margin-top:4px}
.chat-input-bar{display:flex;align-items:center;gap:8px;padding:12px 16px;padding-bottom:calc(12px + var(--safe-bottom));border-top:1px solid var(--border-light);background:var(--bg-card)}
.chat-input{flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius-full);font-size:14px;outline:none;background:var(--bg-input)}
.chat-input:focus{border-color:var(--primary)}
.chat-send{width:36px;height:36px;display:flex;align-items:center;justify-content:center}
.chat-send:disabled{opacity:0.3}
</style>
