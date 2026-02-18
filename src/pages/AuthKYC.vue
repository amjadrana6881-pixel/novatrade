<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Identity Authentication</span><span style="width:32px"></span></div>
    <div class="page-content">
      <div class="kyc-status-card">
        <div class="kyc-icon">
          <svg v-if="status==='approved'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <svg v-else-if="status==='pending'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4M12 16h.01"/></svg>
        </div>
        <h3 class="mt-12 fs-16 fw-600">{{ statusText }}</h3>
        <p class="fs-13 text-muted mt-4">{{ statusDesc }}</p>
      </div>

      <div v-if="status === 'none' || status === 'rejected'">
        <div class="input-group mt-16"><label>Real Name</label><input v-model="form.name" class="input-field" placeholder="Enter your legal name"/></div>
        <div class="input-group"><label>ID Number</label><input v-model="form.idNumber" class="input-field" placeholder="Enter your ID/passport number"/></div>
        <div class="input-group"><label>Country/Region</label>
            <select v-model="form.country" class="input-field"><option value="">Select country</option><option v-for="c in countries" :key="c">{{c}}</option></select></div>
        <div class="upload-section mt-16">
            <h4 class="fs-14 fw-600 mb-12">Upload Documents</h4>
            <div class="upload-grid">
            <div class="upload-box"><div class="upload-placeholder"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span class="fs-11 text-muted mt-4">ID Front</span></div></div>
            <div class="upload-box"><div class="upload-placeholder"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span class="fs-11 text-muted mt-4">ID Back</span></div></div>
            <div class="upload-box"><div class="upload-placeholder"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/></svg><span class="fs-11 text-muted mt-4">Selfie</span></div></div>
            </div>
        </div>
        <button class="btn btn-primary mt-24" @click="submitKYC">Submit for Verification</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import API_BASE_URL from '../config/api.js'

const router = useRouter()
const status = ref('none') // none, pending, approved, rejected
const form = reactive({ name: '', idNumber: '', country: '' })
const countries = ['United States','United Kingdom','Canada','Australia','Germany','France','Japan','South Korea','Singapore','India','Brazil','Nigeria','UAE','Malaysia','Indonesia']

const statusText = computed(() => {
  switch(status.value) {
    case 'approved': return 'Verified'
    case 'pending': return 'Under Review'
    case 'rejected': return 'Verification Failed'
    default: return 'Not Verified'
  }
})

const statusDesc = computed(() => {
  switch(status.value) {
    case 'approved': return 'Your identity has been verified. You have full access.'
    case 'pending': return 'Your documents are being reviewed. This usually takes 24 hours.'
    case 'rejected': return 'Please check your details and try again.'
    default: return 'Complete identity verification to unlock all features'
  }
})

const fetchKYC = async () => {
  const token = localStorage.getItem('nt_token')
  if(!token) return
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.success) {
      status.value = data.data.kycStatus || 'none'
      if(status.value === 'pending' || status.value === 'approved') {
        // Pre-fill if needed, but usually we just show status
      }
    }
  } catch (err) { console.error(err) }
}

const submitKYC = async () => {
  const token = localStorage.getItem('nt_token')
  if(!token) return
  
  if(!form.name || !form.idNumber || !form.country) return alert('Please fill all fields')

  try {
    const res = await fetch(`${API_BASE_URL}/api/user/kyc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (data.success) {
      alert('KYC Submitted Successfully')
      status.value = 'pending'
    } else {
      alert(data.message)
    }
  } catch (err) { console.error(err) }
}

onMounted(fetchKYC)
</script>
<style scoped>
.kyc-status-card{text-align:center;padding:24px;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid var(--border-light)}
.kyc-icon{display:inline-flex}
.upload-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.upload-box{aspect-ratio:1;border:2px dashed var(--border);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;cursor:pointer}
.upload-box:active{border-color:var(--primary);background:var(--primary-light)}
.upload-placeholder{display:flex;flex-direction:column;align-items:center;gap:4px}
</style>
