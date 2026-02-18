<template>
  <div class="login-page">
    <!-- Header -->
    <div class="login-header">
      <button class="login-header__back" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <button class="login-header__globe">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      </button>
    </div>

    <!-- Logo -->
    <div class="login-logo">
      <div class="logo-icon">
        <img src="/logo.png" alt="NovaTrade" width="64" height="64" style="border-radius:12px;"/>
      </div>
    </div>

    <!-- Form -->
    <div class="login-form">
      <div class="input-group">
        <label>Email</label>
        <input
          v-model="form.email"
          type="email"
          class="input-field"
          placeholder="Enter your email address"
        />
      </div>

      <div class="input-group">
        <label>Password</label>
        <div class="password-wrap">
          <input
            v-model="form.password"
            :type="showPwd ? 'text' : 'password'"
            class="input-field"
            placeholder="Enter your password"
          />
          <button class="pwd-toggle" @click="showPwd = !showPwd">
            <svg v-if="!showPwd" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
        </div>
      </div>

      <button class="btn btn-primary btn-lg login-btn" :class="{ loading }" @click="handleLogin">
        <span v-if="loading" class="spinner"></span>
        <span v-else>Login</span>
      </button>

      <div class="login-links">
        <router-link to="/forgot-password" class="forgot-link">Forgot Password?</router-link>
        <span class="register-link">No account, <router-link to="/register">Register Now</router-link></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import API_BASE_URL from '../config/api.js'

const router = useRouter()
const showPwd = ref(false)
const loading = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.email || !form.password) return
  loading.value = true
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()

    if (data.success) {
      localStorage.setItem('nt_token', data.data.token)
      localStorage.setItem('nt_user', JSON.stringify(data.data.user))
      // Redirect to home page
      router.push('/home')
    } else {
      alert(data.message || 'Login failed')
    }
  } catch (err) {
    alert('Server error. Please check your connection.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: var(--bg-card);
  padding: 0 24px;
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  padding-top: calc(var(--safe-top) + 16px);
}

.login-header__back, .login-header__globe {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.login-logo {
  display: flex;
  justify-content: center;
  padding: 32px 0 40px;
}

.logo-icon {
  animation: fadeIn 0.5s ease;
}

.login-form {
  animation: slideUp 0.4s ease;
}

.password-wrap {
  position: relative;
}

.pwd-toggle {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px;
}

.login-btn {
  margin-top: 32px;
  height: 48px;
  border-radius: var(--radius-md);
  font-size: 16px;
}

.login-btn.loading {
  opacity: 0.8;
  pointer-events: none;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.login-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 13px;
}

.forgot-link {
  color: var(--danger);
  font-weight: 500;
}

.register-link {
  color: var(--text-secondary);
}

.register-link a {
  color: var(--primary);
  font-weight: 600;
}
</style>
