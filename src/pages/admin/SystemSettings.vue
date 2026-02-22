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
      <div class="form-group">
        <label>App Download Link (APK)</label>
        <input v-model="config.app_download_link" type="text" class="input-field" placeholder="/moneymint.apk" />
      </div>
    </div>

    <div class="card mb-20">
      <h3>Deposit Methods</h3>
      <p class="fs-12 text-muted mb-12">Set specific deposit addresses or links for each coin/network.</p>
      
      <div v-for="(method, idx) in depositMethods" :key="idx" class="method-row card-flat mb-10">
        <div class="method-grid">
          <div class="form-group">
            <label>Coin</label>
            <select v-model="method.coin" class="input-field sm">
              <option v-for="c in coins" :key="c" :value="c">{{c}}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Network</label>
            <select v-model="method.network" class="input-field sm">
              <option v-for="n in networks" :key="n" :value="n">{{n}}</option>
            </select>
          </div>
          <div class="form-group full-width">
            <label>Wallet Address / Payment Link</label>
            <input v-model="method.address" class="input-field" placeholder="Enter address or link" />
          </div>
        </div>
        <button class="btn btn-danger btn-sm delete-btn" @click="depositMethods.splice(idx, 1)">Remove</button>
      </div>
      
      <button class="btn btn-secondary btn-sm mt-10" @click="addMethod">+ Add Method</button>
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

const config = ref({ announcement: '', support_link: '', app_download_link: '' })
const depositMethods = ref([])
const referralRatesJson = ref('[]')
const saving = ref(false)

const coins = ['USDT','BTC','ETH','BNB','XRP','SOL','DOGE','ADA','DOT','AVAX']
const networks = ['TRC20','ERC20','BEP20','Address','Link']

const fetchSettings = async () => {
  try {
    const res = await fetch(`${API}/config/admin`, { headers }).then(r => r.json())
    if (res.success) {
      config.value.announcement = res.data.announcement || ''
      config.value.support_link = res.data.support_link || ''
      config.value.app_download_link = res.data.app_download_link || ''
      
      try {
        const methods = JSON.parse(res.data.deposit_addresses || '[]')
        // Migration: if old format (array of strings), convert to new format
        depositMethods.value = methods.map(m => {
          if (typeof m === 'string') return { coin: 'USDT', network: 'TRC20', address: m }
          return m
        })
      } catch { depositMethods.value = [] }

      try {
        const rates = JSON.parse(res.data.referral_rates || '[]')
        referralRatesJson.value = JSON.stringify(rates, null, 2)
      } catch { referralRatesJson.value = '[]' }
    }
  } catch (err) {
    console.error(err)
  }
}

const addMethod = () => {
  depositMethods.value.push({ coin: 'USDT', network: 'TRC20', address: '' })
}

const saveSettings = async () => {
  saving.value = true
  try {
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
      app_download_link: config.value.app_download_link,
      deposit_addresses: depositMethods.value.filter(m => m.address.trim() !== ''),
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
.settings-page { max-width: 800px; margin: 0 auto; padding: 20px; }
.card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #E8ECF2; }
.card-flat { background: #F8FAFC; padding: 16px; border-radius: 8px; border: 1px solid #E2E8F0; }
.mb-20 { margin-bottom: 20px; }
.mb-10 { margin-bottom: 10px; }
.mb-12 { margin-bottom: 12px; }
.mt-10 { margin-top: 10px; }
h3 { margin-bottom: 16px; font-size: 16px; font-weight: 600; border-bottom: 1px solid #F4F6FA; padding-bottom: 10px; }
.form-group { margin-bottom: 12px; }
.form-group label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #64748B; text-transform: uppercase; }
.input-field { width: 100%; padding: 10px; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.2s; background: white; }
.input-field:focus { border-color: #2563EB; }
.input-field.sm { padding: 8px; }
.mono { font-family: monospace; font-size: 12px; }

.method-row { position: relative; }
.method-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.full-width { grid-column: span 2; }
.delete-btn { position: absolute; top: 12px; right: 12px; }

.btn { padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; transition: opacity 0.2s; font-family: 'Outfit', sans-serif; }
.btn:hover { opacity: 0.9; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-primary { background: #2563EB; color: white; width: 100%; }
.btn-secondary { background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0; }
.btn-danger { background: #FEF2F2; color: #EF4444; }
.btn-sm { padding: 6px 12px; font-size: 12px; }

.fs-12 { font-size: 12px; }
.text-muted { color: #94A3B8; }
</style>
