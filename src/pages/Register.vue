<template>
  <div class="register-page">
    <div class="page-header" style="background:transparent;border:none;">
      <button class="page-header__back" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <span class="page-header__title">Register</span>
      <button class="page-header__action">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      </button>
    </div>

    <div class="register-form">
      <div class="input-group">
        <label>Email</label>
        <input v-model="form.email" type="email" class="input-field" placeholder="Please enter your email address" />
      </div>

      <div class="input-group">
        <label>Verification Code</label>
        <div class="input-with-action">
          <input v-model="form.verifyCode" class="input-field" placeholder="Please enter the verification code" />
          <button class="input-action-btn" :disabled="countdown > 0" @click="sendCode">
            {{ countdown > 0 ? `${countdown}s` : 'Send Code' }}
          </button>
        </div>
      </div>

      <div class="input-group">
        <label>Password</label>
        <input v-model="form.password" type="password" class="input-field" placeholder="The login password must contain at least 8 characters" />
      </div>

      <div class="input-group">
        <label>Confirm Password</label>
        <input v-model="form.confirmPassword" type="password" class="input-field" placeholder="Please confirm your password" />
      </div>

      <div class="input-group">
        <label>Invitation Code <span class="optional">(Optional)</span></label>
        <input v-model="form.inviteCode" class="input-field" placeholder="Invitation code (optional)" />
      </div>

      <div class="agree-row">
        <button class="checkbox" :class="{ checked: agreed }" @click="agreed = !agreed">
          <svg v-if="agreed" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
        <span class="agree-text">
          You have agreed <a href="#">«User agreement»</a> and understand ours
          <a href="#">«Privacy Protocol»</a> <a href="#">«Legal Provisions»</a>
        </span>
      </div>

      <div class="message-box" v-if="message" :class="messageType">
        {{ message }}
      </div>

      <button class="btn btn-primary btn-lg" :disabled="!agreed || loading" @click="handleRegister" style="margin-top:24px;">
        <span v-if="loading" class="spinner"></span>
        <span v-else>Register</span>
      </button>

      <div class="login-link">
        Register, <router-link to="/login">Log in now</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const agreed = ref(false)
const countdown = ref(0)
const loading = ref(false)
const message = ref('')
const messageType = ref('error') // error or success

const form = reactive({
  email: '',
  verifyCode: '',
  password: '',
  confirmPassword: '',
  inviteCode: route.query.ref || ''
})

const showMessage = (msg, type = 'error') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => message.value = '', 5000)
}

const sendCode = async () => {
  if (!form.email) {
    showMessage('Please enter email address')
    return
  }
  if (countdown.value > 0) return

  try {
    const res = await fetch('http://localhost:3001/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, type: 'register' })
    })
    const data = await res.json()
    if (data.success) {
      showMessage('Verification code sent to your email!', 'success')
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) clearInterval(timer)
      }, 1000)
    } else {
      showMessage(data.message || 'Failed to send code')
    }
  } catch (err) {
    showMessage('Server error. Please check your connection.')
  }
}

const handleRegister = async () => {
  if (!form.email || !form.password || !form.verifyCode) {
    showMessage('Please fill in all fields')
    return
  }
  if (form.password !== form.confirmPassword) {
    showMessage('Passwords do not match')
    return
  }
  if (!agreed.value) {
    showMessage('Please agree to the terms')
    return
  }

  loading.value = true
  try {
    const res = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    
    if (data.success) {
      showMessage('Registration successful!', 'success')
      localStorage.setItem('nt_token', data.data.token)
      localStorage.setItem('nt_user', JSON.stringify(data.data.user))
      // Add slight delay to show success message
      setTimeout(() => router.push('/'), 1000)
    } else {
      showMessage(data.message || 'Registration failed')
    }
  } catch (err) {
    showMessage('Server error during registration')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.message-box {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 20px;
  text-align: center;
}
.message-box.error {
  background: #FFF1F3;
  color: #FF4D4F;
  border: 1px solid #FFCCC7;
}
.message-box.success {
  background: #F6FFED;
  color: #52C41A;
  border: 1px solid #B7EB8F;
}
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.register-page {
  min-height: 100vh;
  background: var(--bg-card);
}

.register-form {
  padding: 8px 24px 32px;
  animation: slideUp 0.4s ease;
}

.agree-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 20px;
}

.checkbox {
  width: 18px;
  height: 18px;
  min-width: 18px;
  border: 1.5px solid var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  transition: var(--transition);
}

.checkbox.checked {
  background: var(--primary);
  border-color: var(--primary);
}

.agree-text {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.agree-text a {
  color: var(--primary);
  font-weight: 500;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: var(--text-secondary);
}

.login-link a {
  color: var(--primary);
  font-weight: 600;
}

.optional {
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 400;
  margin-left: 4px;
}
</style>
