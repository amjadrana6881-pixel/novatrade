<template>
  <div class="settings-page">
    <div class="card mb-20">
      <h3>General Settings</h3>
      <div class="form-group">
        <label>Home Announcement</label>
        <textarea v-model="config.announcement" rows="3" class="input-field"></textarea>
      </div>
      <div class="form-group">
        <label>Customer Support Link</label>
        <input v-model="config.support_link" type="text" class="input-field" placeholder="https://t.me/..." />
      </div>
    </div>

    <div class="card mb-20">
      <h3>Deposit Addresses (TRC20)</h3>
      <div v-for="(addr, idx) in depositAddresses" :key="idx" class="address-row">
        <input v-model="depositAddresses[idx]" class="input-field" placeholder="TRC20 Address" />
        <button class="btn btn-danger btn-sm" @click="depositAddresses.splice(idx, 1)">Remove</button>
      </div>
      <button class="btn btn-secondary btn-sm mt-10" @click="depositAddresses.push('')">+ Add Address</button>
    </div>

    <div class="card mb-20">
      <h3>Referral Rates (JSON)</h3>
      <div class="form-group">
        <label>Edit raw JSON configuration for referral rates</label>
        <textarea v-model="referralRatesJson" rows="10" class="input-field mono"></textarea>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-primary" @click="saveSettings" :disabled="saving">
        {{ saving ? 'Saving...' : 'Save All Settings' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import API_BASE_URL from '../../config/api.js'
const API = `${API_BASE_URL}/api`
const token = localStorage.getItem('nt_admin_token')
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

const config = ref({ announcement: '', support_link: '' })
const depositAddresses = ref([])
const referralRatesJson = ref('[]')
const saving = ref(false)

const fetchSettings = async () => {
  try {
    const res = await fetch(`${API}/config/admin`, { headers }).then(r => r.json())
    if (res.success) {
      config.value.announcement = res.data.announcement || ''
      config.value.support_link = res.data.support_link || ''
      
      try {
        depositAddresses.value = JSON.parse(res.data.deposit_addresses || '[]')
      } catch { depositAddresses.value = [] }

      try {
        // Pretty print JSON
        const rates = JSON.parse(res.data.referral_rates || '[]')
        referralRatesJson.value = JSON.stringify(rates, null, 2)
      } catch { referralRatesJson.value = '[]' }
    }
  } catch (err) {
    console.error(err)
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    // Validate JSON
    let rates = []
    try {
      rates = JSON.parse(referralRatesJson.value)
    } catch {
      alert('Invalid JSON in Referral Rates')
      saving.value = false
      return
    }

    const payload = {
      announcement: config.value.announcement,
      support_link: config.value.support_link,
      deposit_addresses: depositAddresses.value.filter(a => a.trim() !== ''),
      referral_rates: rates
    }

    const res = await fetch(`${API}/config`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload)
    }).then(r => r.json())

    if (res.success) alert('Settings saved successfully!')
    else alert(res.message)
  } catch (err) {
    console.error(err)
    alert('Failed to save settings')
  }
  saving.value = false
}

onMounted(fetchSettings)
</script>

<style scoped>
.settings-page { max-width: 800px; margin: 0 auto; }
.card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #E8ECF2; }
.mb-20 { margin-bottom: 20px; }
.mt-10 { margin-top: 10px; }
h3 { margin-bottom: 16px; font-size: 16px; font-weight: 600; border-bottom: 1px solid #F4F6FA; padding-bottom: 10px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: #4B5563; }
.input-field { width: 100%; padding: 10px; border: 1px solid #E8ECF2; border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.2s; }
.input-field:focus { border-color: #1A6CFF; }
.mono { font-family: monospace; font-size: 12px; }
.address-row { display: flex; gap: 10px; margin-bottom: 10px; }
.btn { padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
.btn:hover { opacity: 0.9; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-primary { background: #1A6CFF; color: white; width: 100%; }
.btn-secondary { background: #F4F6FA; color: #1A6CFF; border: 1px solid #E8F0FF; }
.btn-danger { background: #FFF1F3; color: #FF4D6A; }
.btn-sm { padding: 6px 12px; font-size: 12px; }
</style>
