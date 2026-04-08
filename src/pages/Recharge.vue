<template>
  <div class="page">
    <div class="page-header">
      <button class="page-header__back" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <span class="page-header__title">Deposit USDT</span>
      <span style="width:32px"></span>
    </div>

    <div class="page-content">
      <div class="card mb-16">
        <div class="form-group">
          <label>Selected Asset</label>
          <div class="asset-display">
            <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT" width="24" height="24" />
            <span class="fs-15 fw-600 ml-8">USDT</span>
          </div>
        </div>
        <div class="form-group mt-12">
          <label>Select Network</label>
          <div class="network-tabs">
            <button v-for="n in networks" :key="n" @click="network = n; updateAddress()" :class="{active: network === n}" class="network-tab">
              {{ n }}
            </button>
          </div>
        </div>
      </div>


      <div v-if="address" class="qr-section">
        <div class="qr-placeholder">
          <img v-if="qrUrl" :src="qrUrl" alt="QR Code" width="160" height="160" />
          <div v-else class="shimmer qr-shimmer"></div>
        </div>
        <div class="address-box mt-16">
          <label class="fs-12 text-muted">{{ network }} Deposit Link / Address</label>
          <div class="address-text">{{ address }}</div>
          <button class="btn btn-primary btn-sm mt-12" @click="copyAddr">
            <span class="flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-4"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy Link / Address
            </span>
          </button>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-state__icon">⚠️</div>
        <div class="empty-state__text">No deposit address set for USDT ({{ network }}). Please contact support.</div>
        <a v-if="supportLink" :href="supportLink" target="_blank" class="btn btn-outline btn-sm mt-16">Contact Support</a>
      </div>

      <div v-show="address" class="submission-form card mt-16">
        <h4 class="fs-14 fw-600 mb-12">Submit Deposit Details</h4>
        <div class="form-group">
          <label>Deposit Amount (USDT)</label>
          <input type="number" v-model="form.amount" placeholder="0.00" class="form-input" />
        </div>
        <div class="form-group mt-12">
          <label>Transaction ID (TXID)</label>
          <input type="text" v-model="form.txHash" placeholder="Enter TXID" class="form-input" />
        </div>
        <div class="form-group mt-12">
          <label>Upload Payment Screenshot</label>
          <div class="upload-box" @click="$refs.fileInput.click()">
            <input type="file" ref="fileInput" hidden accept="image/*" @change="handleFile" />
            <div v-if="form.proof" class="preview-wrap">
              <img :src="form.proof" class="proof-preview" />
              <div class="upload-overlay">Change Image</div>
            </div>
            <div v-else class="upload-placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              <div class="fs-12 mt-4">Click to Upload Screenshot</div>
            </div>
          </div>
        </div>
        <button class="btn btn-primary w-100 mt-16" :disabled="submitting" @click="submitDeposit">
          {{ submitting ? 'Submitting...' : 'Submit Review' }}
        </button>
      </div>

      <div class="card mt-16 warning-card">
        <p class="fs-12">⚠️ Important: Only send <strong>USDT ({{ network }})</strong> to this address. Sending any other coin or using a different network will result in permanent loss.</p>
      </div>

      <div class="instructions card mt-16">
        <h4 class="fs-14 fw-600 mb-8">Deposit Instructions</h4>
        <ul class="fs-13 text-secondary">
          <li>1. Ensure you have selected the correct network ({{ network }}).</li>
          <li>2. Copy the deposit address or scan the QR code.</li>
          <li>3. Send the amount from your wallet or exchange.</li>
          <li>4. After successful transfer, your balance will be updated automatically upon blockchain confirmation (usually 5-10 mins).</li>
        </ul>
      </div>

      <!-- Deposit History -->
      <div class="history-section">
        <div class="history-header">
          <span class="history-title">Deposit History</span>
          <span class="history-count" v-if="depositHistory.length > 0">{{ depositHistory.length }}</span>
        </div>

        <div v-if="historyLoading" class="history-loading">Loading...</div>

        <div v-else-if="depositHistory.length === 0" class="history-empty">
          <div class="history-empty-icon">📋</div>
          <div>No deposits yet</div>
        </div>

        <div v-else class="history-list">
          <div v-for="d in depositHistory" :key="d.id" class="history-card">
            <div class="history-card-top">
              <div class="history-card-coin">
                <div class="history-coin-badge">{{ d.coin }}</div>
                <div>
                  <div class="fw-600 fs-14">{{ d.amount }} {{ d.coin }}</div>
                  <div class="fs-11 text-muted">{{ d.network }}</div>
                </div>
              </div>
              <span class="history-status" :class="d.status">{{ d.status }}</span>
            </div>
            <div v-if="d.txHash" class="history-card-row">
              <span class="text-muted">TXID</span>
              <span class="mono fs-11 history-addr">{{ d.txHash.length > 20 ? d.txHash.slice(0,12)+'...'+d.txHash.slice(-8) : d.txHash }}</span>
            </div>
            <div class="history-card-row">
              <span class="text-muted">Date</span>
              <span class="fs-12">{{ formatDate(d.createdAt) }}</span>
            </div>
            <div v-if="d.status === 'rejected' && d.reviewNote" class="history-reject-reason">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <span>{{ d.reviewNote }}</span>
            </div>
            <div v-if="d.status === 'approved'" class="history-approved-msg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>Deposit approved & credited to your wallet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import API_BASE_URL from '../config/api.js'

const coin = ref('USDT')
const network = ref('TRC20')
const networks = ['TRC20','ERC20']

const address = ref('')
const qrUrl = ref('')
const supportLink = ref('')
const allMethods = ref([])
const submitting = ref(false)
const depositHistory = ref([])
const historyLoading = ref(false)
const form = ref({
  amount: '',
  txHash: '',
  proof: ''
})

const fetchMethods = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/config/public`).then(r => r.json())
    if (res.success) {
      allMethods.value = res.data.deposit_addresses || []
      supportLink.value = res.data.support_link || ''
      updateAddress()
    }
  } catch (err) {
    console.error(err)
  }
}

const handleFile = (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) return alert('File size must be less than 2MB')
  
  const reader = new FileReader()
  reader.onload = (ev) => {
    form.value.proof = ev.target.result
  }
  reader.readAsDataURL(file)
}

const submitDeposit = async () => {
  if (!form.value.amount || form.value.amount <= 0) return alert('Please enter a valid amount')
  if (!form.value.txHash) return alert('Please enter Transaction ID')
  
  submitting.value = true
  try {
    const token = localStorage.getItem('nt_token')
    const res = await fetch(`${API_BASE_URL}/api/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        coin: coin.value,
        network: network.value,
        amount: form.value.amount,
        txHash: form.value.txHash,
        proof: form.value.proof,
        address: address.value
      })
    }).then(r => r.json())

    if (res.success) {
      alert('Deposit submitted successfully! It will be reviewed by admin.')
      form.value = { amount: '', txHash: '', proof: '' }
      fetchDepositHistory()
    } else {
      alert(res.message || 'Submission failed')
    }
  } catch (err) {
    alert('System error. Please try again later.')
  } finally {
    submitting.value = false
  }
}

const updateAddress = () => {
  const rawMethods = allMethods.value || []
  const methods = rawMethods.map(m => {
    if (typeof m === 'string') return { coin: 'USDT', network: 'TRC20', address: m }
    return m
  })
  
  const filtered = methods.filter(m => m.coin === 'USDT' && (m.network === network.value || (network.value === 'TRC20' && !m.network)))
  
  if (filtered.length > 0) {
    address.value = filtered[0].address
    qrUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address.value)}`
  } else {
    address.value = ''
    qrUrl.value = ''
  }
}

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const fetchDepositHistory = async () => {
  historyLoading.value = true
  try {
    const token = localStorage.getItem('nt_token')
    const res = await fetch(`${API_BASE_URL}/api/deposit`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.success) depositHistory.value = data.data || []
  } catch (e) { console.error(e) }
  finally { historyLoading.value = false }
}

onMounted(() => {
  fetchMethods()
  fetchDepositHistory()
})

const copyAddr = () => {
  if (!address.value) return
  navigator.clipboard?.writeText(address.value).then(() => {
    alert('Address copied to clipboard!')
  }).catch(() => {
    alert('Failed to copy. Please select and copy manually.')
  })
}
</script>

<style scoped>
.form-group label { display: block; font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-bottom: 6px; }
.asset-display { display: flex; align-items: center; padding: 12px; background: var(--bg-input); border-radius: 8px; border: 1px solid var(--border-light); }

.network-tabs { display: flex; gap: 8px; }
.network-tab { flex: 1; padding: 10px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-weight: 500; color: var(--text-secondary); background: var(--bg-card); transition: all 0.2s; }
.network-tab.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2); }

.qr-section { display: flex; flex-direction: column; align-items: center; padding: 32px 24px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light); }
.qr-placeholder { padding: 12px; background: white; border-radius: 12px; border: 1px solid var(--border-light); box-shadow: var(--shadow-sm); }
.qr-shimmer { width: 160px; height: 160px; border-radius: 8px; }

.address-box { width: 100%; text-align: center; }
.address-text { font-size: 14px; font-weight: 600; font-family: monospace; word-break: break-all; padding: 12px; background: var(--bg-input); border-radius: var(--radius-md); margin-top: 6px; border: 1px solid var(--border-light); }

.warning-card { background: #FFFBEB !important; border-left: 4px solid #F59E0B !important; color: #92400E; }
.instructions ul { list-style: none; }
.instructions li { margin-bottom: 8px; line-height: 1.4; position: relative; padding-left: 12px; }
.instructions li::before { content: '•'; position: absolute; left: 0; color: var(--primary); font-weight: bold; }

.empty-state { padding: 40px 24px; text-align: center; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border); }
.empty-state__icon { font-size: 32px; margin-bottom: 12px; }
.empty-state__text { font-size: 14px; color: var(--text-secondary); }

.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.ml-8 { margin-left: 8px; }
.ml-12 { margin-left: 12px; }
.mr-4 { margin-right: 4px; }
.w-100 { width: 100%; }

.form-input { width: 100%; padding: 12px; background: var(--bg-input); border: 1px solid var(--border-light); border-radius: 8px; font-size: 14px; color: var(--text-primary); }
.upload-box { border: 2px dashed var(--border); border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; min-height: 120px; display: flex; align-items: center; justify-content: center; background: var(--bg-input); }
.upload-box:hover { border-color: var(--primary); background: rgba(37, 99, 235, 0.05); }
.preview-wrap { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
.proof-preview { width: 100%; height: 100%; object-fit: contain; }
.upload-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; font-size: 11px; padding: 4px; opacity: 0; transition: 0.2s; }
.upload-box:hover .upload-overlay { opacity: 1; }
.upload-placeholder { color: var(--text-secondary); display: flex; flex-direction: column; align-items: center; }

/* History Section */
.history-section{margin-top:28px;padding-top:20px;border-top:1px solid var(--border-light, #E8ECF2)}
.history-header{display:flex;align-items:center;gap:8px;margin-bottom:14px}
.history-title{font-size:16px;font-weight:700;color:var(--text, #1A1D26)}
.history-count{background:var(--primary, #1A6CFF);color:white;font-size:11px;font-weight:600;padding:2px 8px;border-radius:10px;min-width:20px;text-align:center}
.history-loading{text-align:center;padding:24px;color:#9CA3AF;font-size:13px}
.history-empty{text-align:center;padding:32px 16px;color:#9CA3AF;font-size:13px}
.history-empty-icon{font-size:28px;margin-bottom:8px}
.history-list{display:flex;flex-direction:column;gap:10px}

.history-card{background:var(--bg-card, #fff);border:1px solid var(--border-light, #E8ECF2);border-radius:12px;padding:14px 16px}
.history-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px}
.history-card-coin{display:flex;align-items:center;gap:10px}
.history-coin-badge{background:linear-gradient(135deg,#00C087,#00E09A);color:white;font-size:11px;font-weight:700;padding:6px 10px;border-radius:8px;letter-spacing:.5px}

.history-status{display:inline-block;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;text-transform:capitalize;letter-spacing:.3px}
.history-status.pending{background:#FFF8ED;color:#E6A01F;border:1px solid #FFE4A0}
.history-status.approved{background:#E6F9F1;color:#00A870;border:1px solid #B5EEDD}
.history-status.rejected{background:#FFF1F3;color:#E03E5A;border:1px solid #FFBDCA}

.history-card-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;font-size:13px;border-bottom:1px solid var(--border-light, #F4F6FA)}
.history-card-row:last-child{border:none}
.history-card-row .text-muted{color:#9CA3AF;font-size:12px}
.history-addr{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mono{font-family:'SF Mono',Monaco,Consolas,monospace}

.history-reject-reason{display:flex;align-items:flex-start;gap:8px;margin-top:10px;padding:10px 12px;background:#FFF1F3;border-radius:8px;border:1px solid #FFBDCA;font-size:12px;color:#E03E5A;line-height:1.4}
.history-reject-reason svg{flex-shrink:0;margin-top:1px}

.history-approved-msg{display:flex;align-items:center;gap:8px;margin-top:10px;padding:10px 12px;background:#E6F9F1;border-radius:8px;border:1px solid #B5EEDD;font-size:12px;color:#00A870;line-height:1.4}
.history-approved-msg svg{flex-shrink:0}

.fw-600{font-weight:600}.fs-11{font-size:11px}.fs-12{font-size:12px}.fs-14{font-size:14px}
</style>
