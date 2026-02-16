<template>
  <div class="page me-page">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="profile-info" @click="$router.push('/account-settings')">
        <div class="avatar">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
        <div class="profile-text">
          <h3>{{ user.email || 'Login / Register' }}</h3>
          <span class="vip-badge">{{ user.vipLevel || 'V' }}</span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </div>

      <div class="profile-actions">
        <router-link to="/upgrade" class="profile-action-card">
          <span class="profile-action-icon">🏆</span>
          <span class="profile-action-label">Upgrade</span>
        </router-link>
        <router-link to="/welfare" class="profile-action-card">
          <span class="profile-action-icon">🎁</span>
          <span class="profile-action-label">Welfare</span>
        </router-link>
        <router-link to="/loan" class="profile-action-card">
          <span class="profile-action-icon">💰</span>
          <span class="profile-action-label">Loan</span>
        </router-link>
        <router-link to="/invite" class="profile-action-card">
          <span class="profile-action-icon">👥</span>
          <span class="profile-action-label">Invite</span>
        </router-link>
      </div>
    </div>

    <!-- Menu Items -->
    <div class="menu-section">
      <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="list-item">
        <div class="list-item__left">
          <div class="list-item__icon" :style="{ background: item.bg }">
            <span v-html="item.icon"></span>
          </div>
          <div class="list-item__text"><h4>{{ item.label }}</h4></div>
        </div>
        <div class="list-item__right">
          <span class="list-item__arrow">›</span>
        </div>
      </router-link>
    </div>

    <!-- Second Section -->
    <div class="menu-section" style="margin-top:12px;">
      <router-link v-for="item in menuItems2" :key="item.path" :to="item.path" class="list-item">
        <div class="list-item__left">
          <div class="list-item__icon" :style="{ background: item.bg }">
            <span v-html="item.icon"></span>
          </div>
          <div class="list-item__text"><h4>{{ item.label }}</h4></div>
        </div>
        <div class="list-item__right">
          <span class="list-item__arrow">›</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const stored = JSON.parse(localStorage.getItem('nt_user') || '{}')
const user = reactive({ email: stored.email || '', vipLevel: stored.vipLevel || 'V' })

const menuItems = [
  { label: 'Security Center', path: '/security', bg: '#E8F0FF', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A6CFF" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
  { label: 'Identity Authentication', path: '/kyc', bg: '#E6F9F3', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C087" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>' },
  { label: 'My Delegation', path: '/delegation', bg: '#F3E8FF', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' },
  { label: 'Withdrawal Address', path: '/withdrawal-address', bg: '#FFF5EB', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF9F43" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' },
  { label: 'Message Notification', path: '/message-notification', bg: '#FFF0F1', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5455C" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' },
]

const menuItems2 = [
  { label: 'Activity', path: '/activity', bg: '#FFF5EB', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF9F43" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' },
  { label: 'Regulated', path: '/regulated', bg: '#E8F0FF', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A6CFF" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' },
  { label: 'About', path: '/about', bg: '#E6F9F3', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C087" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>' },
  { label: 'Help Center', path: '/help', bg: '#F3E8FF', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
  { label: 'Service', path: '/service', bg: '#E8F0FF', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A6CFF" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
]
</script>

<style scoped>
.me-page { background: var(--bg); }

.profile-header {
  padding: 20px 16px;
  padding-top: calc(var(--safe-top) + 20px);
  background: var(--bg-card);
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B9D, #C850C0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-text { flex: 1; }
.profile-text h3 { font-size: 16px; font-weight: 600; }

.vip-badge {
  display: inline-block;
  padding: 2px 10px;
  background: var(--warning-light);
  color: var(--warning);
  font-size: 11px;
  font-weight: 700;
  border-radius: var(--radius-full);
  margin-top: 4px;
}

.profile-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.profile-action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
}

.profile-action-icon { font-size: 24px; }

.profile-action-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.menu-section {
  background: var(--bg-card);
  margin-top: 12px;
}
</style>
