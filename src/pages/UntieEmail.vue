<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Untie Email</span><span style="width:32px"></span></div>
    <div class="page-content">
      <div class="input-group"><label>Current Email</label><input :value="email" class="input-field" disabled /></div>
      <div class="input-group"><label>Email Verification Code</label>
        <div class="input-with-action"><input v-model="code" class="input-field" placeholder="Enter verification code"/><button class="input-action-btn" :disabled="cd>0" @click="sendCode">{{ cd>0?cd+'s':'Send Code' }}</button></div></div>
      <button class="btn btn-primary mt-24">Confirm Unbind</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const stored = JSON.parse(localStorage.getItem('nt_user') || '{}')
const email = stored.email || 'user@example.com'
const code = ref('')
const cd = ref(0)
const sendCode = () => { cd.value = 60; const t = setInterval(() => { cd.value--; if(cd.value<=0) clearInterval(t) }, 1000) }
</script>
