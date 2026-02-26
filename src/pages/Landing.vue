<template>
  <div class="landing-page">
    <div class="landing-bg"></div>
    <div class="landing-content">
      <div class="logo-container">
        <img src="/logo.png" alt="NovaTrade" class="app-logo" />
        <h1 class="app-name">NovaTrade</h1>
        <p class="app-tagline">Your Trusted Crypto Earnings Platform</p>
      </div>

      <div class="features-list">
        <div class="feature-item">
          <div class="icon-box">🚀</div>
          <div class="text">
            <h3>Fast & Secure</h3>
            <p>High-frequency trading with bank-level security.</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="icon-box">📈</div>
          <div class="text">
            <h3>Staking Rewards</h3>
            <p>Earn fixed returns on your crypto holdings.</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="icon-box">💰</div>
          <div class="text">
            <h3>Daily Returns</h3>
            <p>Stable income with flexible staking plans.</p>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <router-link to="/login" class="btn btn-login">Login / Register</router-link>
        <a href="/public/novatrade.apk" download class="btn btn-download">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Android App
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: linear-gradient(160deg, #0f172a 0%, #1e293b 40%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.landing-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.15) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 80%, rgba(124,58,237,0.1) 0%, transparent 50%);
  pointer-events: none;
}

.landing-content {
  max-width: 480px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.logo-container {
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 20px rgba(37,99,235,0.3));
  border-radius: 16px;
}

.app-name {
  font-size: 36px;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
  letter-spacing: -0.5px;
  font-family: 'Outfit', sans-serif;
}

.app-tagline {
  color: #94a3b8;
  font-size: 15px;
  margin-top: 8px;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
  margin-bottom: 44px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255,255,255,0.04);
  padding: 16px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.06);
  backdrop-filter: blur(8px);
  transition: all 0.25s ease;
}

.feature-item:hover {
  background: rgba(255,255,255,0.07);
  border-color: rgba(37,99,235,0.2);
  transform: translateX(4px);
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(37,99,235,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.text h3 {
  font-size: 15px;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 3px 0;
}

.text p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.btn {
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn:active {
  transform: scale(0.98);
}

.btn-login {
  background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(37,99,235,0.35);
}

.btn-login:hover {
  box-shadow: 0 6px 28px rgba(37,99,235,0.45);
}

.btn-download {
  background: rgba(255,255,255,0.06);
  color: #e2e8f0;
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(4px);
}

.btn-download:hover {
  background: rgba(255,255,255,0.1);
}
</style>
