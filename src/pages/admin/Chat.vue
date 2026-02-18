<template>
  <div class="chat-admin">
    <!-- User List (sidebar on desktop, top bar on mobile) -->
    <div class="chat-sidebar-admin" :class="{hidden: selectedUser && isMobile}">
      <h3 class="panel-title">Conversations</h3>
      <div v-if="chats.length===0" class="empty-sm">No conversations yet</div>
      <div v-for="c in chats" :key="c.userId" class="chat-user-item" :class="{active:selectedUser===c.userId}" @click="selectUser(c.userId)">
        <div class="chat-user-email">{{ c.userId.slice(0,8) }}...</div>
        <div class="chat-user-meta">{{ c._count?.id || 0 }} msgs</div>
      </div>
    </div>
    <!-- Chat Area -->
    <div class="chat-main-admin" :class="{hidden: !selectedUser && isMobile}">
      <div v-if="!selectedUser && !isMobile" class="empty-chat">Select a conversation</div>
      <template v-if="selectedUser">
        <div class="chat-top-bar">
          <button v-if="isMobile" class="back-btn" @click="selectedUser=null">← Back</button>
          <span class="chat-top-id">User: {{ selectedUser.slice(0,12) }}...</span>
        </div>
        <div class="chat-messages-admin" ref="chatBox">
          <div v-for="m in messages" :key="m.id" class="chat-msg-admin" :class="{bot: m.fromBot}">
            <div class="msg-sender">{{ m.fromBot ? '🤖 Bot' : '👤 User' }}</div>
            <div class="msg-text">{{ m.message }}</div>
            <div class="msg-time">{{ new Date(m.createdAt).toLocaleTimeString() }}</div>
          </div>
        </div>
        <div class="chat-input-admin">
          <input v-model="reply" placeholder="Type reply..." @keyup.enter="sendReply"/>
          <button @click="sendReply" :disabled="!reply.trim()">Send</button>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import API_BASE_URL from '../../config/api.js'
const API = `${API_BASE_URL}/api`
const token = localStorage.getItem('nt_admin_token')
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

const chats = ref([])
const selectedUser = ref(null)
const messages = ref([])
const reply = ref('')
const chatBox = ref(null)
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value <= 768)

const fetchChats = async () => {
  const res = await fetch(`${API}/chat/admin/chats`, { headers }).then(r => r.json())
  if (res.success) chats.value = res.data
}

const selectUser = async (userId) => {
  selectedUser.value = userId
  messages.value = [{ id: 1, message: 'Chat history will display here', fromBot: true, createdAt: new Date() }]
  await nextTick()
  if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight
}

const sendReply = async () => {
  if (!reply.value.trim()) return
  messages.value.push({ id: Date.now(), message: reply.value, fromBot: true, createdAt: new Date() })
  reply.value = ''
  await nextTick()
  if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight
}

onMounted(() => {
  fetchChats()
  window.addEventListener('resize', () => windowWidth.value = window.innerWidth)
})
</script>
<style scoped>
.chat-admin{display:flex;height:calc(100vh - 120px);background:white;border-radius:12px;border:1px solid #E8ECF2;overflow:hidden}

/* Sidebar */
.chat-sidebar-admin{width:260px;border-right:1px solid #E8ECF2;overflow-y:auto;flex-shrink:0}
.panel-title{padding:16px;font-size:14px;font-weight:600;border-bottom:1px solid #E8ECF2;margin:0}
.chat-user-item{padding:12px 16px;cursor:pointer;border-bottom:1px solid #F4F6FA;transition:background .1s}
.chat-user-item:hover{background:#F4F6FA}
.chat-user-item.active{background:#E8F0FF}
.chat-user-email{font-size:13px;font-weight:500;color:#1A1D26}
.chat-user-meta{font-size:11px;color:#9CA3AF;margin-top:2px}

/* Main chat */
.chat-main-admin{flex:1;display:flex;flex-direction:column;min-width:0}
.chat-top-bar{padding:12px 16px;border-bottom:1px solid #E8ECF2;display:flex;align-items:center;gap:8px}
.chat-top-id{font-size:13px;font-weight:500;color:#1A1D26}
.back-btn{border:none;background:none;color:#1A6CFF;font-size:14px;font-weight:500;cursor:pointer;padding:0}
.empty-chat{display:flex;align-items:center;justify-content:center;height:100%;color:#9CA3AF;font-size:14px}
.chat-messages-admin{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.chat-msg-admin{max-width:75%;padding:10px 14px;border-radius:12px;background:#F4F6FA}
.chat-msg-admin.bot{align-self:flex-end;background:#E8F0FF}
.msg-sender{font-size:11px;font-weight:600;color:#6B7280;margin-bottom:4px}
.msg-text{font-size:14px;color:#1A1D26;word-break:break-word}
.msg-time{font-size:10px;color:#9CA3AF;margin-top:4px}
.chat-input-admin{display:flex;gap:8px;padding:12px 16px;border-top:1px solid #E8ECF2}
.chat-input-admin input{flex:1;padding:8px 14px;border:1px solid #E8ECF2;border-radius:8px;font-size:14px;outline:none;min-width:0}
.chat-input-admin input:focus{border-color:#1A6CFF}
.chat-input-admin button{padding:8px 20px;border:none;border-radius:8px;background:#1A6CFF;color:white;font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap}
.chat-input-admin button:disabled{opacity:.5}
.empty-sm{text-align:center;padding:32px;color:#9CA3AF;font-size:13px}

.hidden{display:none!important}

@media(max-width:768px){
  .chat-admin{flex-direction:column;height:calc(100vh - 80px)}
  .chat-sidebar-admin{width:100%;border-right:none;border-bottom:1px solid #E8ECF2;max-height:100%}
  .chat-main-admin{flex:1;min-height:0}
  .chat-msg-admin{max-width:85%}
  .chat-input-admin{padding:8px 12px;gap:6px}
  .chat-input-admin button{padding:8px 14px;font-size:12px}
}
@media(max-width:480px){
  .chat-input-admin input{padding:7px 10px;font-size:13px}
}
</style>
