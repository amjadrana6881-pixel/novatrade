<template>
  <div>
    <div class="toolbar">
      <h3 class="toolbar-title">Homepage Banners</h3>
      <button class="add-btn" @click="showForm = true">+ Add Banner</button>
    </div>

    <!-- Banner List -->
    <div class="banner-grid">
      <div v-for="b in banners" :key="b.id" class="banner-card">
        <div class="banner-img-wrap">
          <img :src="b.imageUrl.startsWith('data:') ? b.imageUrl : apiBase + b.imageUrl" :alt="b.title" class="banner-img"/>
          <div class="banner-badges">
            <span class="badge-sm" :class="{active: b.isActive, inactive: !b.isActive}">{{ b.isActive ? 'Active' : 'Hidden' }}</span>
            <span class="order-badge">Order: {{ b.sortOrder }}</span>
          </div>
        </div>
        <div class="banner-info">
          <div class="fw-600">{{ b.title }}</div>
          <div class="fs-12 text-muted">{{ b.description || 'No description' }}</div>
        </div>
        <div class="banner-actions">
          <button class="action-btn" @click="toggleActive(b)">{{ b.isActive ? '🙈 Hide' : '👁 Show' }}</button>
          <button class="action-btn edit" @click="editBanner(b)">✏️ Edit</button>
          <button class="action-btn delete" @click="deleteBanner(b.id)">🗑 Delete</button>
        </div>
      </div>
    </div>

    <div v-if="banners.length === 0" class="empty-state-admin">No banners yet. Click "+ Add Banner" to create one.</div>

    <!-- Add/Edit Modal -->
    <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal-card">
        <h3>{{ editing ? 'Edit Banner' : 'Add Banner' }}</h3>
        <div class="form-group">
          <label>Title *</label>
          <input v-model="form.title" placeholder="Banner title" class="form-input"/>
        </div>
        <div class="form-group">
          <label>Description</label>
          <input v-model="form.description" placeholder="Short description (optional)" class="form-input"/>
        </div>
        <div class="form-group">
          <label>Link URL</label>
          <input v-model="form.linkUrl" placeholder="https://... (optional)" class="form-input"/>
        </div>
        <div class="form-group">
          <label>Sort Order</label>
          <input v-model.number="form.sortOrder" type="number" placeholder="0" class="form-input sm"/>
        </div>
        <div class="form-group">
          <label>Image {{ editing ? '(leave empty to keep current)' : '*' }}</label>
          <div class="file-upload">
            <input type="file" ref="fileInput" accept="image/*,.svg" @change="handleFile" class="file-input"/>
            <div v-if="previewUrl" class="preview-wrap">
              <img :src="previewUrl" class="preview-img"/>
            </div>
          </div>
        </div>
        <div class="modal-btns">
          <button class="btn-cancel" @click="closeForm">Cancel</button>
          <button class="btn-save" @click="saveBanner" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
        </div>
        <div v-if="formError" class="form-error">{{ formError }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import API_BASE_URL from '../../config/api.js'
const apiBase = API_BASE_URL
const API = `${apiBase}/api`
const token = localStorage.getItem('nt_admin_token')
const headers = { Authorization: `Bearer ${token}` }

const banners = ref([])
const showForm = ref(false)
const editing = ref(null)
const saving = ref(false)
const formError = ref('')
const fileInput = ref(null)
const previewUrl = ref(null)
const selectedFile = ref(null)

const form = reactive({ title: '', description: '', linkUrl: '', sortOrder: 0 })

const fetchBanners = async () => {
  const res = await fetch(`${API}/banners/all`, { headers }).then(r => r.json())
  if (res.success) banners.value = res.data
}

const handleFile = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const saveBanner = async () => {
  if (!form.title) { formError.value = 'Title is required'; return }
  if (!editing.value && !selectedFile.value) { formError.value = 'Please select an image'; return }

  saving.value = true; formError.value = ''

  const fd = new FormData()
  fd.append('title', form.title)
  fd.append('description', form.description)
  fd.append('linkUrl', form.linkUrl)
  fd.append('sortOrder', form.sortOrder)
  if (selectedFile.value) fd.append('image', selectedFile.value)
  if (editing.value) fd.append('isActive', form.isActive)

  const url = editing.value ? `${API}/banners/${editing.value}` : `${API}/banners`
  const method = editing.value ? 'PUT' : 'POST'

  try {
    const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: fd }).then(r => r.json())
    if (res.success) { closeForm(); fetchBanners() }
    else formError.value = res.message
  } catch (err) { formError.value = err.message }
  saving.value = false
}

const editBanner = (b) => {
  editing.value = b.id
  form.title = b.title
  form.description = b.description || ''
  form.linkUrl = b.linkUrl || ''
  form.sortOrder = b.sortOrder
  form.isActive = b.isActive
  previewUrl.value = b.imageUrl.startsWith('data:') ? b.imageUrl : apiBase + b.imageUrl
  selectedFile.value = null
  showForm.value = true
}

const deleteBanner = async (id) => {
  if (!confirm('Delete this banner?')) return
  await fetch(`${API}/banners/${id}`, { method: 'DELETE', headers })
  fetchBanners()
}

const toggleActive = async (b) => {
  const fd = new FormData()
  fd.append('isActive', !b.isActive)
  await fetch(`${API}/banners/${b.id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: fd })
  fetchBanners()
}

const closeForm = () => {
  showForm.value = false; editing.value = null; formError.value = ''
  form.title = ''; form.description = ''; form.linkUrl = ''; form.sortOrder = 0
  previewUrl.value = null; selectedFile.value = null
}

onMounted(fetchBanners)
</script>
<style scoped>
.toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px}
.toolbar-title{font-family:'Outfit',sans-serif;font-size:18px;font-weight:600;color:#1A1D26;margin:0}
.add-btn{padding:8px 18px;border:none;border-radius:8px;background:linear-gradient(135deg,#1A3A8A,#1A6CFF);color:white;font-size:13px;font-weight:600;cursor:pointer}
.add-btn:hover{opacity:.9}

.banner-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
.banner-card{background:white;border-radius:12px;border:1px solid #E8ECF2;overflow:hidden}
.banner-img-wrap{position:relative;height:140px;background:#F4F6FA}
.banner-img{width:100%;height:100%;object-fit:cover}
.banner-badges{position:absolute;top:8px;right:8px;display:flex;gap:4px}
.badge-sm{padding:3px 8px;border-radius:4px;font-size:10px;font-weight:600}
.badge-sm.active{background:#E6F9F1;color:#00C087}
.badge-sm.inactive{background:#FFF1F3;color:#FF4D6A}
.order-badge{padding:3px 8px;border-radius:4px;font-size:10px;font-weight:600;background:rgba(0,0,0,.5);color:white}
.banner-info{padding:12px 14px 8px}
.banner-actions{display:flex;gap:6px;padding:8px 14px 12px;flex-wrap:wrap}
.action-btn{padding:5px 10px;border-radius:6px;border:1px solid #E8ECF2;background:white;font-size:11px;cursor:pointer}
.action-btn:hover{background:#F4F6FA}
.action-btn.delete{color:#FF4D6A;border-color:#FFD0D8}
.action-btn.delete:hover{background:#FFF1F3}
.action-btn.edit{color:#1A6CFF;border-color:#C9DDFF}
.action-btn.edit:hover{background:#E8F0FF}
.fw-600{font-weight:600}.fs-12{font-size:12px}.text-muted{color:#9CA3AF}

.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:999;padding:16px}
.modal-card{background:white;border-radius:14px;padding:24px;width:460px;max-width:100%;max-height:90vh;overflow-y:auto}
.modal-card h3{font-size:18px;font-weight:600;margin-bottom:16px}
.form-group{margin-bottom:14px}
.form-group label{display:block;font-size:12px;font-weight:500;color:#4B5563;margin-bottom:6px}
.form-input{width:100%;padding:10px 12px;border:1px solid #E8ECF2;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box}
.form-input:focus{border-color:#1A6CFF}
.form-input.sm{width:100px}
.file-upload{position:relative}
.file-input{width:100%;padding:8px;border:2px dashed #E8ECF2;border-radius:8px;font-size:13px;cursor:pointer;box-sizing:border-box}
.preview-wrap{margin-top:8px;border-radius:8px;overflow:hidden}
.preview-img{width:100%;max-height:150px;object-fit:cover;border-radius:8px}
.modal-btns{display:flex;gap:8px;margin-top:16px}
.btn-cancel{flex:1;padding:10px;border:1px solid #E8ECF2;border-radius:8px;background:white;font-size:14px;cursor:pointer}
.btn-save{flex:1;padding:10px;border:none;border-radius:8px;background:#1A6CFF;color:white;font-size:14px;font-weight:600;cursor:pointer}
.btn-save:disabled{opacity:.5}
.form-error{margin-top:10px;padding:8px;background:#FFF1F3;color:#FF4D6A;border-radius:6px;font-size:13px}
.empty-state-admin{text-align:center;padding:48px;color:#9CA3AF;font-size:14px;background:white;border-radius:12px}

@media(max-width:768px){
  .banner-grid{grid-template-columns:1fr}
  .modal-card{padding:16px;width:100%}
  .toolbar-title{font-size:16px}
}
</style>
