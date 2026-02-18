<template>
  <div class="admin-shell">
    <!-- Mobile overlay -->
    <div v-if="mobileOpen" class="sidebar-overlay" @click="mobileOpen = false"></div>
    <aside class="admin-sidebar" :class="{open: mobileOpen}">
      <div class="sidebar-header">
        <img src="/logo.png" alt="NovaTrade" width="32" height="32" style="border-radius:6px;"/>
        <span class="sidebar-title">NovaTrade</span>
        <button class="close-sidebar" @click="mobileOpen = false"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <nav class="sidebar-nav">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-link" :class="{active: $route.path === item.path}" @click="mobileOpen = false">
          <span class="nav-link__icon" v-html="item.icon"></span>
          <span class="nav-link__label">{{ item.label }}</span>
          <span v-if="item.badge" class="nav-link__badge">{{ item.badge }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <button class="nav-link logout-link" @click="logout">
          <span class="nav-link__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
          <span class="nav-link__label">Logout</span>
        </button>
      </div>
    </aside>
    <main class="admin-main">
      <header class="admin-topbar">
        <button class="mobile-menu-btn" @click="mobileOpen = true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
        <h1 class="topbar-title">{{ pageTitle }}</h1>
        <div class="topbar-right">
          <span class="admin-email">{{ admin.email }}</span>
          <button class="logout-btn-top" @click="logout">Logout</button>
        </div>
      </header>
      <div class="admin-content">
        <router-view />
      </div>
    </main>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const mobileOpen = ref(false)
const admin = JSON.parse(localStorage.getItem('nt_admin') || '{"email":"admin@novatrade.com"}')

const navItems = ref([
  { path: '/admin/dashboard', label: 'Dashboard', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>' },
  { path: '/admin/users', label: 'Users', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { path: '/admin/deposits', label: 'Deposits', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 7l-5-5-5 5"/></svg>', badge: 0 },
  { path: '/admin/withdrawals', label: 'Withdrawals', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22V2M17 17l-5 5-5-5"/></svg>', badge: 0 },
  { path: '/admin/kyc', label: 'KYC Review', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>', badge: 0 },
  { path: '/admin/robots', label: 'Robots', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/><path d="M9 16h6"/></svg>' },
  { path: '/admin/chat', label: 'Support Chat', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
  { path: '/admin/banners', label: 'Banners', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' },
  { path: '/admin/settings', label: 'System Settings', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
])

const pageTitle = computed(() => {
  const item = navItems.value.find(n => route.path.startsWith(n.path))
  return item ? item.label : 'Admin'
})

const logout = () => { localStorage.removeItem('nt_admin'); localStorage.removeItem('nt_admin_token'); router.push('/admin/login') }
</script>
<style scoped>
.admin-shell{display:flex;min-height:100vh;background:#F4F6FA}

/* Sidebar - Desktop */
.admin-sidebar{width:240px;background:white;border-right:1px solid #E8ECF2;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:200;transition:transform .25s ease}
.sidebar-header{display:flex;align-items:center;gap:12px;padding:20px 16px;border-bottom:1px solid #E8ECF2}
.sidebar-title{font-family:'Outfit',sans-serif;font-weight:800;font-size:18px;color:#1A1D26;white-space:nowrap;flex:1}
.close-sidebar{display:none;border:none;background:none;cursor:pointer;color:#6B7280;padding:4px}
.sidebar-nav{flex:1;padding:12px 8px;display:flex;flex-direction:column;gap:2px;overflow-y:auto}
.nav-link{display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:8px;color:#6B7280;text-decoration:none;font-size:14px;font-weight:500;transition:all .15s;cursor:pointer;border:none;background:none;width:100%;text-align:left}
.nav-link:hover{background:#F4F6FA;color:#1A1D26}
.nav-link.active{background:#E8F0FF;color:#1A6CFF}
.nav-link__icon{display:flex;align-items:center;min-width:18px}
.nav-link__label{white-space:nowrap}
.nav-link__badge{margin-left:auto;background:#FF4D6A;color:white;font-size:11px;padding:2px 6px;border-radius:10px;min-width:18px;text-align:center}
.sidebar-footer{padding:8px;border-top:1px solid #E8ECF2}
.logout-link{color:#FF4D6A}

/* Main - Desktop */
.admin-main{flex:1;margin-left:240px;min-width:0}
.admin-topbar{display:flex;align-items:center;gap:12px;padding:16px 24px;background:white;border-bottom:1px solid #E8ECF2;position:sticky;top:0;z-index:50}
.topbar-title{font-family:'Outfit',sans-serif;font-weight:700;font-size:20px;color:#1A1D26;flex:1}
.topbar-right{display:flex;align-items:center;gap:12px}
.admin-email{font-size:13px;color:#6B7280}
.logout-btn-top{padding:6px 14px;border-radius:6px;border:1px solid #E8ECF2;background:white;color:#FF4D6A;font-size:13px;font-weight:500;cursor:pointer}
.logout-btn-top:hover{background:#FFF1F3}
.admin-content{padding:24px}
.mobile-menu-btn{display:none;border:none;background:none;cursor:pointer;color:#4B5563;padding:4px}
.sidebar-overlay{display:none}

/* ======= TABLET ======= */
@media(max-width:1024px){
  .admin-content{padding:16px}
}

/* ======= MOBILE ======= */
@media(max-width:768px){
  .admin-sidebar{transform:translateX(-100%);width:280px;box-shadow:none}
  .admin-sidebar.open{transform:translateX(0);box-shadow:4px 0 24px rgba(0,0,0,.15)}
  .close-sidebar{display:flex}
  .sidebar-overlay{display:block;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:150}
  .admin-main{margin-left:0}
  .mobile-menu-btn{display:flex}
  .admin-topbar{padding:12px 16px}
  .topbar-title{font-size:17px}
  .admin-email{display:none}
  .logout-btn-top{padding:5px 10px;font-size:12px}
  .admin-content{padding:12px}
}

/* ======= SMALL MOBILE ======= */
@media(max-width:480px){
  .admin-sidebar{width:260px}
  .admin-topbar{padding:10px 12px}
  .topbar-title{font-size:15px}
  .admin-content{padding:8px}
}
</style>
