<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
const { t: tr } = useI18n()
const props = defineProps<{ data: { month: string; value: number }[] }>()

const W = 560
const H = 220
const PAD = { l: 36, r: 8, t: 12, b: 24 }
const hasData = computed(() => props.data.some(d => d.value > 0))
const max = Math.max(...props.data.map((d) => d.value), 1)
const points = props.data.map((d, i) => {
  const x = PAD.l + (i / (props.data.length - 1)) * (W - PAD.l - PAD.r)
  const y = PAD.t + (1 - d.value / max) * (H - PAD.t - PAD.b)
  return { x, y, ...d }
})
const line = points.map((p) => `${p.x},${p.y}`).join(' ')
const area = `${PAD.l},${H - PAD.b} ${line} ${W - PAD.r},${H - PAD.b}`
const ticks = [0.25, 0.5, 0.75, 1].map((f) => ({
  y: PAD.t + (1 - f) * (H - PAD.t - PAD.b),
  label: Math.round(max * f / 1000) + 'k'
}))
</script>

<template>
  <div class="rounded-xl border border-border bg-card p-5">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h3 class="font-semibold">{{ tr('dashboard.revenueOverview') }}</h3>
        <p class="text-xs text-muted-foreground">{{ tr('dashboard.revenueSub') }}</p>
      </div>
      <span class="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span class="h-2 w-2 rounded-full bg-primary"></span> {{ tr('dashboard.total') }}
      </span>
    </div>
    <div v-if="!hasData" class="flex h-[200px] items-center justify-center text-sm text-muted-foreground">{{ tr('dashboard.noData') }}</div>
    <svg v-else :viewBox="`0 0 ${W} ${H}`" class="block w-full h-auto">
      <g v-for="t in ticks" :key="t.label">
        <line :x1="PAD.l" :x2="W - PAD.r" :y1="t.y" :y2="t.y" stroke="currentColor" stroke-opacity="0.08" />
        <text :x="4" :y="t.y + 3" font-size="10" class="fill-muted-foreground">{{ t.label }}</text>
      </g>
      <polygon :points="area" class="fill-primary opacity-10" />
      <polyline :points="line" fill="none" class="stroke-primary" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
      <circle v-for="(p, i) in points" :key="i" :cx="p.x" :cy="p.y" r="3.5" class="fill-card stroke-primary" stroke-width="2" />
      <text v-for="(p, i) in points" :key="'m'+i" :x="p.x" :y="H - 8" font-size="10" text-anchor="middle" class="fill-muted-foreground">{{ p.month }}</text>
    </svg>
  </div>
</template>
