<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
import { useAuth } from '~/composables/useAuth'
import StatCard from '~/components/dashboard/StatCard.vue'
import RevenueChart from '~/components/dashboard/RevenueChart.vue'
import RecentSales from '~/components/dashboard/RecentSales.vue'
import { useI18n } from '~/composables/useI18n'
const { t } = useI18n()
const { refresh } = useAuth()
await refresh()

const { data, pending } = await useFetch('/api/stats', { key: 'dashboard-stats' })

const cards = computed(() => [
  { label: t('dashboard.totalRevenue'), value: 'US$' + (data.value?.stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0'), delta: data.value?.stats.totalRevenueDelta || 0, deltaLabel: t('dashboard.fromLastMonth'), icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
  { label: t('dashboard.subscriptions'), value: '+' + (data.value?.stats.subscriptions.toLocaleString() || '0'), delta: data.value?.stats.subscriptionsDelta || 0, deltaLabel: t('dashboard.fromLastMonth'), icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
  { label: t('dashboard.sales'), value: '+' + (data.value?.stats.sales.toLocaleString() || '0'), delta: data.value?.stats.salesDelta || 0, deltaLabel: t('dashboard.fromLastMonth'), icon: 'M3 3v18h18M7 14l4-4 3 3 5-6' },
  { label: t('dashboard.activeNow'), value: '+' + (data.value?.stats.activeNow || '0'), delta: data.value?.stats.activeNowDelta || 0, deltaLabel: t('dashboard.sinceLastHour'), icon: 'M22 12h-4l-3 9L9 3l-3 9H2' }
])
</script>

<template>
  <div v-if="pending" class="text-sm text-muted-foreground">Loading dashboard…</div>
  <div v-else class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard v-for="c in cards" :key="c.label" v-bind="c" />
    </div>
    <div class="grid gap-6 lg:grid-cols-5">
      <div class="lg:col-span-3">
        <RevenueChart :data="data.revenue" />
      </div>
      <div class="lg:col-span-2">
        <RecentSales :sales="data.recentSales" />
      </div>
    </div>
  </div>
</template>
