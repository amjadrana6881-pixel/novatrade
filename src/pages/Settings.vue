<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Settings</span><span style="width:32px"></span></div>
    <div style="margin-top:8px;">
      <div class="list-item"><div class="list-item__left"><div class="list-item__text"><h4>Language</h4></div></div><div class="list-item__right"><span class="fs-13 text-muted">English</span><span class="list-item__arrow">›</span></div></div>
      <div class="list-item"><div class="list-item__left"><div class="list-item__text"><h4>Currency</h4></div></div><div class="list-item__right"><span class="fs-13 text-muted">USD</span><span class="list-item__arrow">›</span></div></div>
      <div class="list-item"><div class="list-item__left"><div class="list-item__text"><h4>Push Notifications</h4></div></div><div class="list-item__right"><label class="toggle"><input type="checkbox" v-model="pushEnabled"/><span class="toggle-slider"></span></label></div></div>
      <div class="list-item"><div class="list-item__left"><div class="list-item__text"><h4>Sound</h4></div></div><div class="list-item__right"><label class="toggle"><input type="checkbox" v-model="soundEnabled"/><span class="toggle-slider"></span></label></div></div>
      <div class="list-item"><div class="list-item__left"><div class="list-item__text"><h4>Price Alerts</h4></div></div><div class="list-item__right"><label class="toggle"><input type="checkbox" v-model="priceAlerts"/><span class="toggle-slider"></span></label></div></div>
    </div>
    <div style="margin-top:12px;">
      <div class="list-item"><div class="list-item__left"><div class="list-item__text"><h4>Clear Cache</h4></div></div><div class="list-item__right"><span class="fs-13 text-muted">2.4 MB</span><span class="list-item__arrow">›</span></div></div>
      <div class="list-item"><div class="list-item__left"><div class="list-item__text"><h4>Check Updates</h4></div></div><div class="list-item__right"><span class="fs-13 text-muted">v1.0.0</span><span class="list-item__arrow">›</span></div></div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const pushEnabled = ref(true)
const soundEnabled = ref(true)
const priceAlerts = ref(false)
</script>
<style scoped>
.toggle{position:relative;display:inline-block;width:44px;height:24px}
.toggle input{opacity:0;width:0;height:0}
.toggle-slider{position:absolute;cursor:pointer;inset:0;background:var(--border);transition:.3s;border-radius:24px}
.toggle-slider:before{content:"";position:absolute;height:18px;width:18px;left:3px;bottom:3px;background:white;transition:.3s;border-radius:50%}
.toggle input:checked+.toggle-slider{background:var(--primary)}
.toggle input:checked+.toggle-slider:before{transform:translateX(20px)}
</style>
