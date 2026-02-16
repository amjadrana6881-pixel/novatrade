<template>
  <div class="forgot-page">
    <div class="page-header" style="background:transparent;border:none;">
      <button class="page-header__back" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <span class="page-header__title">Forgot login password</span>
      <span style="width:32px"></span>
    </div>

    <div class="forgot-form">
      <div class="input-group">
        <label>Account</label>
        <input v-model="form.email" type="email" class="input-field" placeholder="Enter your email address" />
      </div>

      <div class="input-group">
        <label>New Password</label>
        <input v-model="form.newPassword" type="password" class="input-field" placeholder="Enter new password" />
      </div>

      <div class="input-group">
        <label>Confirm Password</label>
        <input v-model="form.confirmPassword" type="password" class="input-field" placeholder="Please confirm your password" />
      </div>

      <div class="input-group">
        <label>Email Verification Code</label>
        <div class="input-with-action">
          <input v-model="form.verifyCode" class="input-field" placeholder="Please enter the verification code" />
          <button class="input-action-btn" :disabled="countdown > 0" @click="sendCode">
            {{ countdown > 0 ? `${countdown}s` : 'Send Code' }}
          </button>
        </div>
      </div>

  <div class="message-box" v-if="message" :class="messageType">
        {{ message }}
      </div>

      <button class="btn btn-confirm" :disabled="loading" @click="handleReset" style="margin-top:40px;">
        <span v-if="loading" class="spinner"></span>
        <span v-else>Confirm</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const countdown = ref(0)
const loading = ref(false)
const message = ref('')
const messageType = ref('error')

const form = reactive({
  email: '',
  newPassword: '',
  confirmPassword: '',
  verifyCode: ''
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
      body: JSON.stringify({ email: form.email, type: 'reset' })
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

const handleReset = async () => {
  if (!form.email || !form.newPassword || !form.verifyCode) {
    showMessage('Please fill in all fields')
    return
  }
  if (form.newPassword !== form.confirmPassword) {
    showMessage('Passwords do not match')
    return
  }

  loading.value = true
  try {
    const res = await fetch('http://localhost:3001/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        password: form.newPassword,
        code: form.verifyCode
      })
    })
    const data = await res.json()
    
    if (data.success) {
      showMessage('Password reset successful! Please login.', 'success')
      setTimeout(() => router.push('/login'), 1500)
    } else {
      showMessage(data.message || 'Reset failed')
    }
  } catch (err) {
    showMessage('Server error during password reset')
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

.forgot-page {
  min-height: 100vh;
  background: var(--bg-card);
}
.forgot-form {
  padding: 8px 24px 32px;
  animation: slideUp 0.4s ease;
}
.btn-confirm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #00C087, #00D4AA);
  color: white;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 16px;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
}
.btn-confirm:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
