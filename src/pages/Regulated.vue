<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Regulated</span><span style="width:32px"></span></div>
    <div class="tabs"><button v-for="t in ['SEC-RIA','MSB']" :key="t" class="tab" :class="{active:tab===t}" @click="tab=t">{{t}}</button></div>
    <div class="page-content">
      <div v-if="tab==='SEC-RIA'" class="card">
        <div class="regulated-badge"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
        <h3 class="text-center mt-12 fs-16 fw-600">SEC-RIA Regulated</h3>
        <div class="mt-16">
          <div class="detail-row"><span>Registration Number</span><span class="fw-600">801-12345</span></div>
          <div class="detail-row"><span>Registration Type</span><span>Investment Advisor</span></div>
          <div class="detail-row"><span>Status</span><span class="badge badge-green">Active</span></div>
          <div class="detail-row"><span>Effective Date</span><span>2024-01-15</span></div>
        </div>
        <p class="fs-12 text-muted mt-16">NovaTrade is a regulated investment advisory platform registered with the U.S. Securities and Exchange Commission (SEC) as a Registered Investment Advisor (RIA).</p>
      </div>
      <div v-else class="card">
        <div class="regulated-badge"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
        <h3 class="text-center mt-12 fs-16 fw-600">MSB Licensed</h3>
        <div class="mt-16">
          <div class="detail-row"><span>License Number</span><span class="fw-600">31000212345678</span></div>
          <div class="detail-row"><span>License Type</span><span>Money Services Business</span></div>
          <div class="detail-row"><span>Status</span><span class="badge badge-green">Active</span></div>
          <div class="detail-row"><span>Issued By</span><span>FinCEN</span></div>
        </div>
        <p class="fs-12 text-muted mt-16">NovaTrade holds a Money Services Business (MSB) license issued by FinCEN, the Financial Crimes Enforcement Network of the U.S. Department of the Treasury.</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const tab = ref('SEC-RIA')
</script>
<style scoped>
.regulated-badge{text-align:center}
.detail-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-light);font-size:13px}
</style>
