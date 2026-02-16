<template>
  <div class="page"><div class="page-header"><button class="page-header__back" @click="$router.back()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button><span class="page-header__title">My Delegation</span><span style="width:32px"></span></div>
    <div class="tabs"><button v-for="t in ['Running','Completed']" :key="t" class="tab" :class="{active:tab===t}" @click="tab=t">{{t}}</button></div>
    <div class="empty-state"><div class="empty-state__icon">📋</div><div class="empty-state__text">No delegation records</div></div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const tab = ref('Running')
</script>
