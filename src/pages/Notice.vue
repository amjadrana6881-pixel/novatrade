<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">Notifications</span><span style="width:32px"></span></div>
    <div class="tabs"><button v-for="t in ['All','System','Price']" :key="t" class="tab" :class="{active:tab===t}" @click="tab=t">{{t}}</button></div>
    <div class="page-content">
      <div v-for="n in filtered" :key="n.id" class="card mb-12">
        <div class="flex justify-between items-center mb-4"><span class="badge" :class="n.type==='System'?'badge-blue':'badge-green'">{{ n.type }}</span><span class="fs-11 text-muted">{{ n.time }}</span></div>
        <h4 class="fs-14 fw-600">{{ n.title }}</h4>
        <p class="fs-13 text-secondary mt-4">{{ n.content }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const tab = ref('All')
const notices = ref([
  { id:1, type:'System', title:'Welcome!', content:'Welcome to NovaTrade. Complete your profile to get started.', time:'Today' },
  { id:2, type:'System', title:'Maintenance Notice', content:'Scheduled maintenance on Feb 20, 2026 from 02:00-04:00 UTC.', time:'Feb 14' },
  { id:3, type:'Price', title:'BTC Alert', content:'Bitcoin has crossed $96,000. Current price: $96,500.', time:'Feb 14' },
])
const filtered = computed(() => tab.value==='All'?notices.value:notices.value.filter(n=>n.type===tab.value))
</script>
