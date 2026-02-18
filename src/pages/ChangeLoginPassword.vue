<template>
  <div class="page">
    <div class="page-header">
      <button class="page-header__back" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <span class="page-header__title">Modify Login Password</span>
      <span style="width:32px"></span>
    </div>
    <div class="page-content">
      <div class="input-group"><label>Current Password</label><input v-model="form.current" type="password" class="input-field" placeholder="Enter current password"/></div>
      <div class="input-group"><label>New Password</label><input v-model="form.newPwd" type="password" class="input-field" placeholder="Enter new password (min 8 characters)"/></div>
      <div class="input-group"><label>Confirm New Password</label><input v-model="form.confirm" type="password" class="input-field" placeholder="Confirm new password"/></div>
      <div v-if="msg" class="feedback-msg" :class="success ? 'success' : 'error'">{{ msg }}</div>
      <button class="btn btn-primary mt-24" :disabled="loading" @click="submit">{{ loading ? 'Saving...' : 'Confirm' }}</button>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import API_BASE_URL from '../config/api.js'
const router = useRouter()
const form = reactive({ current: '', newPwd: '', confirm: '' })
const loading = ref(false)
const msg = ref('')
const success = ref(false)

const submit = async () => {
  msg.value = ''
  if (!form.current || !form.newPwd || !form.confirm) return (msg.value = 'All fields are required')
  if (form.newPwd.length < 8) return (msg.value = 'New password must be at least 8 characters')
  if (form.newPwd !== form.confirm) return (msg.value = 'Passwords do not match')

  loading.value = true
  try {
    const token = localStorage.getItem('nt_token')
    const res = await fetch(`${API_BASE_URL}/api/user/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword: form.current, newPassword: form.newPwd })
    })
    const data = await res.json()
    if (data.success) {
      success.value = true
      msg.value = 'Password changed successfully!'
      setTimeout(() => router.back(), 1500)
    } else {
      success.value = false
      msg.value = data.message || 'Failed to change password'
    }
  } catch (e) {
    success.value = false
    msg.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.feedback-msg{margin-top:12px;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:500}
.feedback-msg.success{background:#E6F9F1;color:#00C087}
.feedback-msg.error{background:#FFF1F3;color:#FF4D6A}
</style>
