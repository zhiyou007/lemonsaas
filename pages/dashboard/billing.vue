<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
import { useAuth } from '~/composables/useAuth'
import { useI18n } from '~/composables/useI18n'
const { t } = useI18n()
const { user, refresh } = useAuth()
await refresh()
const { data: plansData } = await useFetch('/api/plans', { key: 'plans' })
const plans = computed(() => plansData.value?.plans || [])
const currentPlanName = computed(() => {
  const p = user.value?.plan || 'free'
  if (p === 'free') return plansData.value?.freeName || 'Starter'
  return plans.value.find((x: any) => x.priceId === p || x.key === p)?.name || p
})

const route = useRoute()
const notice = computed(() => {
  if (route.query.success) return { type: 'success', text: t('billing.paid') }
  if (route.query.canceled) return { type: 'info', text: t('billing.canceled') }
  return null
})

const loading = ref('')
const error = ref('')

async function checkout(plan: string) {
  error.value = ''
  loading.value = plan
  try {
    const res = await $fetch<{ url: string }>('/api/stripe/checkout', { method: 'POST', body: { plan } })
    if (res.url) window.location.href = res.url
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Could not start checkout.'
  } finally {
    loading.value = ''
  }
}

async function openPortal() {
  error.value = ''
  loading.value = 'portal'
  try {
    const res = await $fetch<{ url: string }>('/api/stripe/portal', { method: 'POST' })
    if (res.url) window.location.href = res.url
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Could not open billing portal.'
  } finally {
    loading.value = ''
  }
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="notice" class="rounded-md border px-4 py-3 text-sm" :class="notice.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600' : 'border-border bg-muted text-muted-foreground'">
      {{ notice.text }}
    </div>
    <p v-if="error" class="rounded-md bg-rose-500/10 px-4 py-3 text-sm text-rose-500">{{ error }}</p>

    <div class="rounded-xl border border-border bg-card p-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-sm text-muted-foreground">{{ t('billing.currentPlan') }}</p>
          <h2 class="mt-1 text-2xl font-bold capitalize">{{ currentPlanName }}</h2>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ user?.plan === 'free' ? t('billing.freeTier') : t('billing.renews') }}
          </p>
        </div>
        <button v-if="user?.plan && user.plan !== 'free'" class="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted" :disabled="loading === 'portal'" @click="openPortal">
          {{ loading === 'portal' ? '…' : t('billing.manage') }}
        </button>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="plan in plans" :key="plan.key" class="rounded-xl border border-border bg-card p-6">
        <h3 class="font-semibold">{{ plan.name }}</h3>
        <p class="mt-1 text-3xl font-extrabold">{{ plan.price }}<span class="text-base font-medium text-muted-foreground">{{ t('billing.perMonth') }}</span></p>
        <p class="mt-2 text-sm text-muted-foreground">{{ plan.desc }}</p>
        <button class="mt-6 w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          :disabled="loading === plan.key" :class="user?.plan === plan.key ? 'opacity-60' : ''" @click="checkout(plan.key)">
          {{ loading === plan.key ? t('billing.upgrading') : (user?.plan === plan.key ? t('billing.current') : 'Upgrade to ' + plan.name) }}
        </button>
      </div>
    </div>

    <div class="rounded-xl border border-border bg-card">
      <div class="border-b border-border p-5">
        <h3 class="font-semibold">{{ t('billing.invoiceHistory') }}</h3>
      </div>
      <div class="p-5 text-sm text-muted-foreground">{{ t('billing.noInvoices') }}</div>
    </div>
  </div>
</template>
