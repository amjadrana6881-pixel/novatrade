<template>
  <div class="page">
    <div class="page-header">
      <button class="page-header__back" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <span class="page-header__title">Identity Authentication</span>
      <span style="width:32px"></span>
    </div>
    <div class="page-content">
      <!-- Status Card -->
      <div class="kyc-status-card">
        <div class="kyc-icon">
          <svg v-if="status==='approved'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <svg v-else-if="status==='pending'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4M12 16h.01"/></svg>
        </div>
        <h3 class="mt-12 fs-16 fw-600">{{ statusText }}</h3>
        <p class="fs-13 text-muted mt-4">{{ statusDesc }}</p>
      </div>

      <!-- Form (only if not approved/pending) -->
      <div v-if="status === 'none' || status === 'rejected'">
        <div class="input-group mt-16"><label>Real Name</label><input v-model="form.name" class="input-field" placeholder="Enter your legal name"/></div>
        <div class="input-group"><label>ID Number</label><input v-model="form.idNumber" class="input-field" placeholder="Enter your ID/passport number"/></div>
        <div class="input-group">
          <label>Country/Region</label>
          <select v-model="form.country" class="input-field">
            <option value="">Select country</option>
            <option v-for="c in countries" :key="c">{{ c }}</option>
          </select>
        </div>

        <!-- Document Upload -->
        <div class="upload-section mt-16">
          <h4 class="fs-14 fw-600 mb-12">Upload Documents</h4>
          <div class="upload-grid">
            <!-- ID Front -->
            <div class="upload-box" @click="triggerUpload('front')">
              <img v-if="previews.front" :src="previews.front" class="upload-preview"/>
              <div v-else class="upload-placeholder">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span class="fs-11 text-muted mt-4">ID Front</span>
              </div>
            </div>
            <!-- ID Back -->
            <div class="upload-box" @click="triggerUpload('back')">
              <img v-if="previews.back" :src="previews.back" class="upload-preview"/>
              <div v-else class="upload-placeholder">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span class="fs-11 text-muted mt-4">ID Back</span>
              </div>
            </div>
            <!-- Selfie -->
            <div class="upload-box" @click="triggerUpload('selfie')">
              <img v-if="previews.selfie" :src="previews.selfie" class="upload-preview"/>
              <div v-else class="upload-placeholder">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/></svg>
                <span class="fs-11 text-muted mt-4">Selfie</span>
              </div>
            </div>
          </div>
          <!-- Hidden file inputs -->
          <input ref="inputFront" type="file" accept="image/*" style="display:none" @change="handleFile('front', $event)"/>
          <input ref="inputBack" type="file" accept="image/*" style="display:none" @change="handleFile('back', $event)"/>
          <input ref="inputSelfie" type="file" accept="image/*" style="display:none" @change="handleFile('selfie', $event)"/>
        </div>

        <div v-if="msg" class="feedback-msg" :class="submitSuccess ? 'success' : 'error'">{{ msg }}</div>
        <button class="btn btn-primary mt-24" :disabled="loading" @click="submitKYC">
          {{ loading ? 'Submitting...' : 'Submit for Verification' }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import API_BASE_URL from '../config/api.js'

const status = ref('none')
const loading = ref(false)
const msg = ref('')
const submitSuccess = ref(false)
const form = reactive({ name: '', idNumber: '', country: '' })
const previews = reactive({ front: '', back: '', selfie: '' })
const images = reactive({ front: '', back: '', selfie: '' }) // base64

const inputFront = ref(null)
const inputBack = ref(null)
const inputSelfie = ref(null)

const countries = ['United States','United Kingdom','Canada','Australia','Germany','France','Japan','South Korea','Singapore','India','Brazil','Nigeria','UAE','Malaysia','Indonesia','Pakistan','Bangladesh','Philippines','Vietnam','Turkey']

const statusText = computed(() => {
  switch(status.value) {
    case 'approved': return 'Verified ✓'
    case 'pending': return 'Under Review'
    case 'rejected': return 'Verification Failed'
    default: return 'Not Verified'
  }
})

const statusDesc = computed(() => {
  switch(status.value) {
    case 'approved': return 'Your identity has been verified. You have full access.'
    case 'pending': return 'Your documents are being reviewed. This usually takes 24 hours.'
    case 'rejected': return 'Your verification was rejected. Please resubmit with correct documents.'
    default: return 'Complete identity verification to unlock all features'
  }
})

const triggerUpload = (type) => {
  if (type === 'front') inputFront.value?.click()
  else if (type === 'back') inputBack.value?.click()
  else inputSelfie.value?.click()
}

const handleFile = (type, event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    previews[type] = e.target.result
    images[type] = e.target.result // base64
  }
  reader.readAsDataURL(file)
}

const fetchKYC = async () => {
  const token = localStorage.getItem('nt_token')
  if (!token) return
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (data.success) {
      status.value = data.data.kycStatus || 'none'
      if (data.data.kycName) form.name = data.data.kycName
      if (data.data.kycIdNumber) form.idNumber = data.data.kycIdNumber
      if (data.data.kycCountry) form.country = data.data.kycCountry
    }
  } catch (err) { console.error(err) }
}

const submitKYC = async () => {
  msg.value = ''
  if (!form.name || !form.idNumber || !form.country) return (msg.value = 'Please fill all fields')

  loading.value = true
  try {
    const token = localStorage.getItem('nt_token')
    const res = await fetch(`${API_BASE_URL}/api/user/kyc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: form.name,
        idNumber: form.idNumber,
        country: form.country,
        idFront: images.front,
        idBack: images.back,
        selfie: images.selfie
      })
    })
    const data = await res.json()
    if (data.success) {
      submitSuccess.value = true
      msg.value = 'KYC submitted successfully! Under review.'
      status.value = 'pending'
    } else {
      submitSuccess.value = false
      msg.value = data.message || 'Submission failed'
    }
  } catch (err) {
    submitSuccess.value = false
    msg.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchKYC)
</script>
<style scoped>
.kyc-status-card{text-align:center;padding:24px;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid var(--border-light)}
.kyc-icon{display:inline-flex}
.upload-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.upload-box{aspect-ratio:1;border:2px dashed var(--border);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative}
.upload-box:active{border-color:var(--primary);background:var(--primary-light)}
.upload-placeholder{display:flex;flex-direction:column;align-items:center;gap:4px}
.upload-preview{width:100%;height:100%;object-fit:cover}
.feedback-msg{margin-top:12px;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:500}
.feedback-msg.success{background:#E6F9F1;color:#00C087}
.feedback-msg.error{background:#FFF1F3;color:#FF4D6A}
</style>
