<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Security Center</span><span style="width:32px"></span></div>
    <div class="page-content">
      <div class="security-score"><div class="score-circle"><span class="score-value">60</span><span class="score-label">Score</span></div><p class="fs-13 text-muted mt-12">Your account security needs improvement</p></div>
      <div class="mt-16">
        <div class="list-item" @click="$router.push('/change-login-password')"><div class="list-item__left"><div class="list-item__icon" style="background:var(--primary-light)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div><div class="list-item__text"><h4>Login Password</h4><p>Modify your login password</p></div></div><div class="list-item__right"><span class="badge badge-green">Set</span><span class="list-item__arrow">›</span></div></div>
        <div class="list-item" @click="$router.push('/change-transaction-password')"><div class="list-item__left"><div class="list-item__icon" style="background:var(--accent-light)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div class="list-item__text"><h4>Transaction Password</h4><p>Set for secure withdrawals</p></div></div><div class="list-item__right"><span class="badge badge-orange">Not Set</span><span class="list-item__arrow">›</span></div></div>
        <div class="list-item"><div class="list-item__left"><div class="list-item__icon" style="background:var(--warning-light)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg></div><div class="list-item__text"><h4>Email Binding</h4><p>Secure your account with email</p></div></div><div class="list-item__right"><span class="badge badge-green">Bound</span><span class="list-item__arrow">›</span></div></div>
        <div class="list-item" @click="$router.push('/kyc')"><div class="list-item__left"><div class="list-item__icon" style="background:#F3E8FF"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg></div><div class="list-item__text"><h4>Identity Verification</h4><p>Complete KYC for full access</p></div></div><div class="list-item__right"><span class="badge badge-orange">Pending</span><span class="list-item__arrow">›</span></div></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.security-score{text-align:center;padding:24px}
.score-circle{width:80px;height:80px;border-radius:50%;border:3px solid var(--warning);display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto}
.score-value{font-size:24px;font-weight:700;font-family:var(--font-heading);color:var(--warning)}
.score-label{font-size:10px;color:var(--text-muted)}
</style>
