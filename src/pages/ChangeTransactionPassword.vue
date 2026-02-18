<template>
  <div class="page">
    <div class="page-header">
      <button class="page-header__back" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <span class="page-header__title">Modify Transaction Password</span>
      <span style="width:32px"></span>
    </div>
    <div class="page-content">
      <div class="info-box">Transaction password is a 6-digit PIN used to confirm withdrawals and sensitive operations.</div>
      <div class="input-group mt-16"><label>New Transaction Password (6 digits)</label><input v-model="form.newPwd" type="password" class="input-field" placeholder="Enter 6-digit PIN" maxlength="6" inputmode="numeric"/></div>
      <div class="input-group"><label>Confirm Transaction Password</label><input v-model="form.confirm" type="password" class="input-field" placeholder="Confirm 6-digit PIN" maxlength="6" inputmode="numeric"/></div>
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
const form = reactive({ newPwd: '', confirm: '' })
const loading = ref(false)
const msg = ref('')
const success = ref(false)

const submit = async () => {
  msg.value = ''
  if (!form.newPwd || !form.confirm) return (msg.value = 'All fields are required')
  if (form.newPwd.length !== 6 || !/^\d{6}$/.test(form.newPwd)) return (msg.value = 'Password must be exactly 6 digits')
  if (form.newPwd !== form.confirm) return (msg.value = 'Passwords do not match')

  loading.value = true
  try {
    const token = localStorage.getItem('nt_token')
    const res = await fetch(`${API_BASE_URL}/api/user/transaction-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ password: form.newPwd })
    })
    const data = await res.json()
    if (data.success) {
      success.value = true
      msg.value = 'Transaction password set successfully!'
      setTimeout(() => router.back(), 1500)
    } else {
      success.value = false
      msg.value = data.message || 'Failed to set password'
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
.info-box{background:var(--bg-card);border:1px solid var(--border-light);border-radius:var(--radius-md);padding:12px 14px;font-size:13px;color:var(--text-muted);line-height:1.5}
.feedback-msg{margin-top:12px;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:500}
.feedback-msg.success{background:#E6F9F1;color:#00C087}
.feedback-msg.error{background:#FFF1F3;color:#FF4D6A}
</style>
