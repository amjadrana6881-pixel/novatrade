<template>
  <div class="admin-login">
    <div class="login-card">
      <div class="login-logo">
        <img src="/logo.png" alt="NovaTrade" width="56" height="56" style="border-radius:12px;"/>
      </div>
      <h1>NovaTrade Admin</h1>
      <p class="subtitle">Sign in to the admin dashboard</p>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <div class="form-group"><label>Email</label><input v-model="email" type="email" placeholder="admin@novatrade.com" @keyup.enter="handleLogin"/></div>
      <div class="form-group"><label>Password</label><input v-model="password" type="password" placeholder="Enter admin password" @keyup.enter="handleLogin"/></div>
      <button class="login-btn" :disabled="loading" @click="handleLogin">{{ loading ? 'Signing in...' : 'Sign In' }}</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import API_BASE_URL from '../../config/api.js'
const router = useRouter()
const email = ref('admin@novatrade.com')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) { error.value = 'Please fill in all fields'; return }
  loading.value = true; error.value = ''
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    const data = await res.json()
    if (!data.success) { error.value = data.message; loading.value = false; return }
    if (!data.data.user.isAdmin) { error.value = 'Admin access required'; loading.value = false; return }
    localStorage.setItem('nt_admin_token', data.data.token)
    localStorage.setItem('nt_admin', JSON.stringify(data.data.user))
    router.push('/admin/dashboard')
  } catch (err) { error.value = 'Server connection failed. Is the API running on port 3001?' }
  loading.value = false
}
</script>
<style scoped>
.admin-login{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0A1628 0%,#1A3A8A 50%,#1A6CFF 100%);padding:24px}
.login-card{background:white;border-radius:16px;padding:40px;width:100%;max-width:400px;text-align:center}
.login-logo{margin-bottom:16px}
.login-card h1{font-family:'Outfit',sans-serif;font-size:24px;font-weight:700;color:#1A1D26;margin-bottom:4px}
.subtitle{color:#6B7280;font-size:14px;margin-bottom:24px}
.form-group{text-align:left;margin-bottom:16px}
.form-group label{display:block;font-size:13px;font-weight:500;color:#4B5563;margin-bottom:6px}
.form-group input{width:100%;padding:10px 14px;border:1px solid #E8ECF2;border-radius:8px;font-size:14px;outline:none;transition:border .15s;box-sizing:border-box}
.form-group input:focus{border-color:#1A6CFF}
.login-btn{width:100%;padding:12px;border:none;border-radius:8px;background:linear-gradient(135deg,#1A3A8A,#1A6CFF);color:white;font-size:15px;font-weight:600;cursor:pointer;margin-top:8px;transition:opacity .15s}
.login-btn:hover{opacity:0.9}.login-btn:disabled{opacity:0.6;cursor:not-allowed}
.error-msg{background:#FFF1F3;color:#FF4D6A;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px}
</style>
