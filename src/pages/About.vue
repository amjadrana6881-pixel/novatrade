<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">About</span><span style="width:32px"></span></div>
    <div class="page-content text-center">
      <img src="/logo.png" alt="NovaTrade" width="64" height="64" style="margin:24px auto 16px;border-radius:12px;display:block;"/>
      <h2 class="font-heading">NovaTrade</h2>
      <p class="fs-13 text-muted mt-4">Version 1.0.0</p>
      <div class="mt-24" style="text-align:left;">
        <div class="list-item"><div class="list-item__left"><div class="list-item__text"><h4>User Agreement</h4></div></div><div class="list-item__right"><span class="list-item__arrow">›</span></div></div>
        <div class="list-item"><div class="list-item__left"><div class="list-item__text"><h4>Privacy Policy</h4></div></div><div class="list-item__right"><span class="list-item__arrow">›</span></div></div>
        <div class="list-item"><div class="list-item__left"><div class="list-item__text"><h4>Legal Provisions</h4></div></div><div class="list-item__right"><span class="list-item__arrow">›</span></div></div>
        <div class="list-item"><div class="list-item__left"><div class="list-item__text"><h4>Risk Disclaimer</h4></div></div><div class="list-item__right"><span class="list-item__arrow">›</span></div></div>
      </div>
      <p class="fs-11 text-muted mt-24">© 2026 NovaTrade. All rights reserved.</p>
    </div>
  </div>
</template>
