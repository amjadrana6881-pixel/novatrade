<template>
  <div class="landing-page">
    <div class="landing-content">
      <div class="logo-container">
        <img src="/logo.png" alt="NovaTrade" class="app-logo" />
        <h1 class="app-name">NovaTrade</h1>
        <p class="app-tagline">Smart AI Quantitative Trading Platform</p>
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
          <div class="icon-box">🤖</div>
          <div class="text">
            <h3>AI Powered</h3>
            <p>Smart robots working 24/7 to maximize profits.</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="icon-box">💰</div>
          <div class="text">
            <h3>Daily Returns</h3>
            <p>Stable income with automated quantitative strategies.</p>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <router-link to="/login" class="btn btn-login">Login / Register</router-link>
        <a href="/moneymint.apk" download class="btn btn-download">
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
  background: linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
}

.landing-content {
  max-width: 480px;
  width: 100%;
}

.logo-container {
  margin-bottom: 40px;
}

.app-logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 12px rgba(0,192,135,0.2));
}

.app-name {
  font-size: 32px;
  font-weight: 800;
  color: #1A1D26;
  margin: 0;
  letter-spacing: -0.5px;
}

.app-tagline {
  color: #6B7280;
  font-size: 16px;
  margin-top: 8px;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
  margin-bottom: 50px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #E8ECF2;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #F0FDF4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.text h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1A1D26;
  margin: 0 0 4px 0;
}

.text p {
  font-size: 13px;
  color: #9CA3AF;
  margin: 0;
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.btn:active {
  transform: scale(0.98);
}

.btn-login {
  background: linear-gradient(135deg, #00C087 0%, #00A876 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 192, 135, 0.3);
}

.btn-download {
  background: white;
  color: #1A1D26;
  border: 1px solid #E8ECF2;
}
</style>
