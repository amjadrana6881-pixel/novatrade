<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Modify Transaction Password</span><span style="width:32px"></span></div>
    <div class="page-content">
      <div class="input-group"><label>New Transaction Password</label><input v-model="form.newPwd" type="password" class="input-field" placeholder="Enter 6-digit transaction password" maxlength="6"/></div>
      <div class="input-group"><label>Confirm Transaction Password</label><input v-model="form.confirm" type="password" class="input-field" placeholder="Confirm transaction password" maxlength="6"/></div>
      <div class="input-group"><label>Email Verification Code</label>
        <div class="input-with-action"><input v-model="form.code" class="input-field" placeholder="Enter verification code"/><button class="input-action-btn" :disabled="cd>0" @click="sendCode">{{ cd>0?cd+'s':'Send Code' }}</button></div></div>
      <button class="btn btn-primary mt-16">Confirm</button>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const form = reactive({ newPwd: '', confirm: '', code: '' })
const cd = ref(0)
const sendCode = () => { cd.value = 60; const t = setInterval(() => { cd.value--; if (cd.value<=0) clearInterval(t) }, 1000) }
</script>
