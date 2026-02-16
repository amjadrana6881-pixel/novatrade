<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Account Settings</span><span style="width:32px"></span></div>
    <div style="margin-top:8px;">
      <div class="list-item"><div class="list-item__left"><div class="list-item__text"><h4>Avatar</h4></div></div><div class="list-item__right"><div class="avatar-sm-s"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div><span class="list-item__arrow">›</span></div></div>
      <div class="list-item"><div class="list-item__left"><div class="list-item__text"><h4>Nickname</h4></div></div><div class="list-item__right"><span class="fs-13 text-muted">Not set</span><span class="list-item__arrow">›</span></div></div>
      <div class="list-item"><div class="list-item__left"><div class="list-item__text"><h4>Email</h4></div></div><div class="list-item__right"><span class="fs-13 text-muted">{{ email || 'Not bound' }}</span><span class="list-item__arrow">›</span></div></div>
      <div class="list-item" @click="$router.push('/change-login-password')"><div class="list-item__left"><div class="list-item__text"><h4>Modify Login Password</h4></div></div><div class="list-item__right"><span class="list-item__arrow">›</span></div></div>
      <div class="list-item" @click="$router.push('/change-transaction-password')"><div class="list-item__left"><div class="list-item__text"><h4>Modify Transaction Password</h4></div></div><div class="list-item__right"><span class="list-item__arrow">›</span></div></div>
      <div class="list-item" @click="$router.push('/untie-email')"><div class="list-item__left"><div class="list-item__text"><h4>Untie Email</h4></div></div><div class="list-item__right"><span class="list-item__arrow">›</span></div></div>
    </div>
    <div style="padding:16px;"><button class="btn" style="background:var(--danger-light);color:var(--danger);" @click="logout">Logout</button></div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const stored = JSON.parse(localStorage.getItem('nt_user') || '{}')
const email = stored.email || ''
const logout = () => { localStorage.removeItem('nt_token'); localStorage.removeItem('nt_user'); router.push('/login') }
</script>
<style scoped>
.avatar-sm-s{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#FF6B9D,#C850C0);display:flex;align-items:center;justify-content:center}
</style>
