<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
const { t } = useI18n()
defineProps<{ sales: { name: string; email: string; amount: number }[] }>()
function money(n: number) {
  return 'US$' + (n / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })
}
</script>

<template>
  <div class="rounded-xl border border-border bg-card p-5">
    <h3 class="font-semibold">{{ t('dashboard.recentSales') }}</h3>
    <div v-if="!sales?.length" class="mt-4 py-8 text-center text-sm text-muted-foreground">{{ t('dashboard.noOrders') }}</div>
    <div v-else class="mt-4 divide-y divide-border">
      <div v-for="s in sales" :key="s.email" class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
          {{ s.name.split(' ').map(w => w[0]).join('') }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium">{{ s.name }}</p>
          <p class="truncate text-xs text-muted-foreground">{{ s.email }}</p>
        </div>
        <p class="text-sm font-semibold">+{{ money(s.amount) }}</p>
      </div>
    </div>
  </div>
</template>
