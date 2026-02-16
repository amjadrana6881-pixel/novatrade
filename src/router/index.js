import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: () => import('../pages/Landing.vue')
    },
    {
        path: '/home',
        component: () => import('../layouts/MainLayout.vue'),
        children: [
            { path: '', name: 'Home', component: () => import('../pages/Home.vue') },
            { path: '/ai', name: 'AI', component: () => import('../pages/Robot.vue') },
            { path: '/exchange', name: 'Exchange', component: () => import('../pages/Exchange.vue') },
            { path: '/contract', name: 'Contract', component: () => import('../pages/Contract.vue') },
            { path: '/assets', name: 'Assets', component: () => import('../pages/Assets.vue') },
            // Sub-pages (kept inside layout for navigation consistency if needed, or move out if they don't need bottom nav)
            // ... keeping existing sub-pages ...
            { path: '/recharge', name: 'Recharge', component: () => import('../pages/Recharge.vue') },
            { path: '/withdraw', name: 'Withdraw', component: () => import('../pages/Withdraw.vue') },
            { path: '/transfer', name: 'Transfer', component: () => import('../pages/Transfer.vue') },
            { path: '/coin-search', name: 'CoinSearch', component: () => import('../pages/CoinSearch.vue') },
            { path: '/me', name: 'Me', component: () => import('../pages/Me.vue') },
            { path: '/account-settings', name: 'AccountSettings', component: () => import('../pages/AccountSettings.vue') },
            { path: '/change-login-password', name: 'ChangeLoginPassword', component: () => import('../pages/ChangeLoginPassword.vue') },
            { path: '/change-transaction-password', name: 'ChangeTransactionPassword', component: () => import('../pages/ChangeTransactionPassword.vue') },
            { path: '/untie-email', name: 'UntieEmail', component: () => import('../pages/UntieEmail.vue') },
            { path: '/withdrawal-address', name: 'WithdrawalAddress', component: () => import('../pages/WithdrawalAddress.vue') },
            { path: '/message-notification', name: 'MessageNotification', component: () => import('../pages/MessageNotification.vue') },
            { path: '/kyc', name: 'KYC', component: () => import('../pages/AuthKYC.vue') },
            { path: '/delegation', name: 'Delegation', component: () => import('../pages/Delegation.vue') },
            { path: '/regulated', name: 'Regulated', component: () => import('../pages/Regulated.vue') },
            { path: '/about', name: 'About', component: () => import('../pages/About.vue') },
            { path: '/upgrade', name: 'Upgrade', component: () => import('../pages/Upgrade.vue') },
            { path: '/welfare', name: 'Welfare', component: () => import('../pages/Welfare.vue') },
            { path: '/loan', name: 'Loan', component: () => import('../pages/Loan.vue') },
            { path: '/invite', name: 'Invite', component: () => import('../pages/Invite.vue') },
            { path: '/exchange-swap', name: 'ExchangeSwap', component: () => import('../pages/ExchangeSwap.vue') },
            { path: '/activity', name: 'Activity', component: () => import('../pages/Activity.vue') },
            { path: '/activity/:id', name: 'ActivityDetail', component: () => import('../pages/ActivityDetail.vue') },
            { path: '/service', name: 'Service', component: () => import('../pages/ServiceChat.vue') },
            { path: '/security', name: 'Security', component: () => import('../pages/Security.vue') },
            { path: '/help', name: 'Help', component: () => import('../pages/Help.vue') },
            { path: '/notice', name: 'Notice', component: () => import('../pages/Notice.vue') },
            { path: '/settings', name: 'Settings', component: () => import('../pages/Settings.vue') },
            { path: '/trade', name: 'Trade', component: () => import('../pages/Trade.vue') },
            { path: '/pledge', name: 'Pledge', component: () => import('../pages/Pledge.vue') },
        ]
    },
    // Auth routes
    { path: '/login', name: 'Login', component: () => import('../pages/Login.vue') },
    { path: '/register', name: 'Register', component: () => import('../pages/Register.vue') },
    { path: '/forgot-password', name: 'ForgotPassword', component: () => import('../pages/ForgotPassword.vue') },

    // Admin routes
    { path: '/admin/login', name: 'AdminLogin', component: () => import('../pages/admin/AdminLogin.vue') },
    {
        path: '/admin',
        component: () => import('../layouts/AdminLayout.vue'),
        children: [
            { path: '', redirect: '/admin/dashboard' },
            { path: 'dashboard', name: 'AdminDashboard', component: () => import('../pages/admin/Dashboard.vue') },
            { path: 'users', name: 'AdminUsers', component: () => import('../pages/admin/Users.vue') },
            { path: 'deposits', name: 'AdminDeposits', component: () => import('../pages/admin/Deposits.vue') },
            { path: 'withdrawals', name: 'AdminWithdrawals', component: () => import('../pages/admin/Withdrawals.vue') },
            { path: 'kyc', name: 'AdminKYC', component: () => import('../pages/admin/KYC.vue') },
            { path: 'robots', name: 'AdminRobots', component: () => import('../pages/admin/Robots.vue') },
            { path: 'chat', name: 'AdminChat', component: () => import('../pages/admin/Chat.vue') },
            { path: 'banners', name: 'AdminBanners', component: () => import('../pages/admin/Banners.vue') },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

export default router
