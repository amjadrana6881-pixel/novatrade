<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Modify Login Password</span><span style="width:32px"></span></div>
    <div class="page-content">
      <div class="input-group"><label>Current Password</label><input v-model="form.current" type="password" class="input-field" placeholder="Enter current password"/></div>
      <div class="input-group"><label>New Password</label><input v-model="form.newPwd" type="password" class="input-field" placeholder="Enter new password (min 8 characters)"/></div>
      <div class="input-group"><label>Confirm New Password</label><input v-model="form.confirm" type="password" class="input-field" placeholder="Confirm new password"/></div>
      <button class="btn btn-primary mt-24">Confirm</button>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
const form = reactive({ current: '', newPwd: '', confirm: '' })
</script>
