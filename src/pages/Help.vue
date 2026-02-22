<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Help Center</span><span style="width:32px"></span></div>
    <div style="padding:12px 16px;"><div style="position:relative;"><input v-model="query" class="input-field" style="background:var(--bg-input);border:none;border-radius:var(--radius-full);padding:10px 14px 10px 36px;" placeholder="Search help articles..."/>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" style="position:absolute;left:12px;top:50%;transform:translateY(-50%)"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div></div>
    <div class="page-content" style="padding-top:0;">
      <div v-for="(cat, ci) in categories" :key="ci" class="help-category">
        <h3 class="fs-15 fw-600 mb-8">{{ cat.title }}</h3>
        <div v-for="(q, qi) in cat.items" :key="qi" class="help-item" @click="q.open=!q.open">
          <div class="flex justify-between items-center"><span class="fs-14">{{ q.question }}</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" :style="{transform:q.open?'rotate(180deg)':''}"><polyline points="6 9 12 15 18 9"/></svg></div>
          <p v-if="q.open" class="fs-13 text-secondary mt-8" style="line-height:1.6;">{{ q.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const query = ref('')
const categories = reactive([
  { title: '💰 Deposit & Withdrawal', items: [
    { question: 'How to deposit USDT?', answer: 'Go to Assets > Deposit, select USDT and the network (TRC20 recommended), copy the deposit address, and send USDT from your external wallet.', open: false },
    { question: 'How long does withdrawal take?', answer: 'Most withdrawals are processed within 30 minutes. During peak times, it may take up to 24 hours. Make sure you have a transaction password set.', open: false },
    { question: 'What are the withdrawal limits?', answer: 'Withdrawal limits depend on your VIP level. V users can withdraw up to 5 times/day. Higher VIP levels have increased limits.', open: false },
  ]},
  { title: '📈 Staking Plans', items: [
    { question: 'How do staking plans work?', answer: 'Choose a staking plan that fits your budget. Lock your USDT for a fixed period and receive guaranteed returns when the plan matures. Your principal plus profit is automatically credited to your wallet.', open: false },
    { question: 'What are the return rates?', answer: 'Returns depend on the plan tier. Higher value plans generally offer better returns. Check the Earn page for specific rates and lock periods.', open: false },
  ]},
  { title: '👤 Account & Security', items: [
    { question: 'How to reset my password?', answer: 'Go to Login > Forgot Password, enter your email, receive a verification code, and set a new password.', open: false },
    { question: 'How to complete KYC?', answer: 'Go to Profile > Identity Authentication. Fill in your name, ID number, country, and upload photos of your ID (front, back) and a selfie.', open: false },
  ]},
])
</script>
<style scoped>
.help-category{margin-bottom:20px}
.help-item{padding:12px 16px;background:var(--bg-card);border-radius:var(--radius-md);margin-bottom:8px;border:1px solid var(--border-light);cursor:pointer}
</style>
