<template>
  <div class="page contract-page">
    <div class="exchange-header" style="background:var(--bg-card);">
      <div class="pair-selector"><span class="pair-name">BTC/USDT</span> <span class="fs-12 text-muted">Perpetual</span></div>
      <div class="pair-price text-green">${{ formatPrice(price) }}</div>
      <div class="pair-change text-green">+2.34%</div>
    </div>

    <!-- Tabs: Open, Positions, Close, Current, History -->
    <div class="tabs">
      <button v-for="t in ['Open','Positions','Close','Current','History']" :key="t" class="tab" :class="{active:tab===t}" @click="tab=t" style="font-size:12px;">{{t}}</button>
    </div>

    <!-- Chart -->
    <div style="padding:8px 16px;background:var(--bg-card);border-bottom:1px solid var(--border-light);">
      <svg width="100%" height="100" viewBox="0 0 400 100" preserveAspectRatio="none">
        <defs><linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00C087" stop-opacity="0.2"/><stop offset="1" stop-color="#00C087" stop-opacity="0"/></linearGradient></defs>
        <path d="M0,80 L50,60 L100,70 L150,40 L200,50 L250,30 L300,35 L350,20 L400,25 L400,100 L0,100 Z" fill="url(#cg2)"/>
        <path d="M0,80 L50,60 L100,70 L150,40 L200,50 L250,30 L300,35 L350,20 L400,25" fill="none" stroke="#00C087" stroke-width="2"/>
      </svg>
    </div>

    <!-- Contract Trading UI -->
    <div style="padding:12px 16px;background:var(--bg-card);">
      <div class="flex items-center justify-between mb-8">
        <span class="fs-13 fw-600">Leverage</span>
        <div class="flex gap-8">
          <button v-for="l in ['10x','20x','50x','100x','125x']" :key="l" class="leverage-btn" :class="{active:leverage===l}" @click="leverage=l">{{l}}</button>
        </div>
      </div>

      <div class="pill-tabs mb-12">
        <button class="pill-tab" :class="{active:cSide==='long'}" @click="cSide='long'" :style="cSide==='long'?'background:var(--accent);color:white':''">Long</button>
        <button class="pill-tab" :class="{active:cSide==='short'}" @click="cSide='short'" :style="cSide==='short'?'background:var(--danger);color:white':''">Short</button>
      </div>

      <div class="input-group">
        <label>Margin (USDT)</label>
        <input v-model="margin" type="number" class="input-field" placeholder="Enter margin amount"/>
      </div>

      <div class="flex justify-between fs-13 text-muted mb-8">
        <span>Available: 0.00 USDT</span>
        <span>Fee: 0.05%</span>
      </div>

      <button class="btn" :class="cSide==='long'?'btn-buy':'btn-sell'">
        {{cSide==='long'?'Open Long':'Open Short'}}
      </button>
    </div>

    <!-- Positions -->
    <div class="empty-state" style="background:var(--bg);">
      <div class="empty-state__icon">📊</div>
      <div class="empty-state__text">No open positions</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const tab = ref('Open')
const leverage = ref('20x')
const cSide = ref('long')
const margin = ref('')
const price = ref(96500)
const formatPrice = (p) => p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
</script>

<style scoped>
.contract-page { background: var(--bg); }
.exchange-header { display:flex;align-items:center;gap:12px;padding:12px 16px;padding-top:calc(var(--safe-top)+12px); }
.pair-selector { display:flex;align-items:center;gap:6px; }
.pair-name { font-family:var(--font-heading);font-weight:700;font-size:17px; }
.pair-price { font-weight:700;font-size:16px; }
.pair-change { font-size:13px;font-weight:600; }
.leverage-btn { padding:4px 8px;font-size:11px;border-radius:4px;color:var(--text-muted);font-weight:500; }
.leverage-btn.active { background:var(--primary-light);color:var(--primary);font-weight:600; }
</style>
