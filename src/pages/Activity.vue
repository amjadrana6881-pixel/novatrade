<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Activity</span><span style="width:32px"></span></div>
    <div class="page-content">
      <div v-for="act in activities" :key="act.id" class="activity-card" @click="$router.push('/activity/'+act.id)">
        <div class="activity-banner" :style="{background:act.bg}">
          <h3>{{ act.title }}</h3>
          <p>{{ act.desc }}</p>
        </div>
        <div class="activity-meta"><span class="fs-12 text-muted">{{ act.date }}</span><span class="badge badge-green">Active</span></div>
      </div>
    </div>
  </div>
</template>
<script setup>
const activities = [
  { id: 'carnival', title: '🎉 Grand Carnival', desc: 'Top traders win up to 10,000 USDT prize', date: '2026-01-01 ~ 2026-03-31', bg: 'linear-gradient(135deg, #FF6B9D, #C850C0)' },
  { id: 'consultant', title: '💼 Consultant Salary', desc: 'Earn monthly salary as a promotion consultant', date: '2026-01-01 ~ 2026-12-31', bg: 'linear-gradient(135deg, #1A3A8A, #1A6CFF)' },
  { id: 'dinner', title: '🍽️ Dinner Reimbursement', desc: 'Get dining expenses reimbursed with VIP status', date: '2026-01-01 ~ 2026-12-31', bg: 'linear-gradient(135deg, #00856F, #00C087)' },
]
</script>
<style scoped>
.activity-card{background:var(--bg-card);border-radius:var(--radius-lg);overflow:hidden;margin-bottom:16px;border:1px solid var(--border-light);cursor:pointer;transition:var(--transition)}
.activity-card:active{transform:scale(0.98)}
.activity-banner{padding:24px 20px;color:white}
.activity-banner h3{font-size:18px;margin-bottom:4px}
.activity-banner p{font-size:13px;opacity:0.85}
.activity-meta{display:flex;justify-content:space-between;align-items:center;padding:12px 16px}
</style>
