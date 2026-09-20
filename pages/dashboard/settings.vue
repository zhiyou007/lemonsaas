<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
import { useI18n } from '~/composables/useI18n'
const { t } = useI18n()
const tab = ref('brand')
const tabs = computed(() => [
  { key: 'brand', label: t('set.brand') },
  { key: 'auth', label: t('set.auth') },
  { key: 'payment', label: t('set.payment') },
])

const { data, refresh } = await useFetch('/api/admin/onboarding', { key: 'onboarding' })
const { data: cfg, refresh: refreshCfg } = await useFetch('/api/admin/settings', { key: 'admin-settings' })
const siteName = ref(data.value?.siteName || 'Lumen')
const logo = ref(data.value?.logo || '')
const seoTitle = ref(data.value?.seoTitle || '')
const seoDescription = ref(data.value?.seoDescription || '')
const analyticsId = ref(data.value?.analyticsId || '')
const siteUrl = ref(data.value?.siteUrl || '')
const ogImage = ref(data.value?.ogImage || '')
function onPickOg(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 500 * 1024) { logoError.value = 'OG image must be under 500 KB'; return }
  const reader = new FileReader()
  reader.onload = () => { ogImage.value = reader.result as string }
  reader.readAsDataURL(file)
}
const logoError = ref('')
const saving = ref(false)
const msg = ref('')

// Editable credential fields (secret fields start blank; "***" means unchanged).
const googleClientId = ref(cfg.value?.googleClientId || '')
const googleClientSecret = ref(cfg.value?.googleClientSecret || '')
const stripeSecretKey = ref(cfg.value?.stripeSecretKey || '')
const stripePublishableKey = ref(cfg.value?.stripePublishableKey || '')
const stripeWebhookSecret = ref(cfg.value?.stripeWebhookSecret || '')
const freeEnabled = ref(cfg.value?.freeEnabled !== false)
const freeName = ref(cfg.value?.freeName || 'Starter')
const freeDesc = ref(cfg.value?.freeDesc || '')
// Dynamic plans list: {key,name,price,desc,priceId}
const plans = ref(Array.isArray(cfg.value?.plans) ? cfg.value.plans.map((p: any) => {
  // Migrate old `price` string like "$19.90/month" into `amount` + priceType.
  let amount = p.amount
  let priceType = p.priceType
  if (!amount && p.price) {
    const m = String(p.price).match(/[\d.]+/)
    amount = m ? m[0] : ''
    if (/year/i.test(p.price)) priceType = priceType || 'yearly'
    else if (/one.time|lifetime/i.test(p.price)) priceType = priceType || 'lifetime'
    else if (/mo|month/i.test(p.price)) priceType = priceType || 'monthly'
  }
  return { key: p.key, name: p.name, amount, priceType: priceType || 'monthly', desc: p.desc, priceId: p.priceId, enabled: p.enabled !== false, highlighted: !!p.highlighted }
}) : [])
function addPlan() {
  plans.value.push({ key: '', name: '', amount: '', priceType: 'monthly', desc: '', priceId: '', enabled: true, highlighted: false })
}
function removePlan(i: number) {
  plans.value.splice(i, 1)
}
function onHighlight(i: number) {
  const p = plans.value[i]
  if (p?.highlighted) plans.value.forEach((q: any, j: number) => { if (j !== i) q.highlighted = false })
}
const syncing = ref(false)
async function syncFromStripe() {
  syncing.value = true
  try {
    const res = await $fetch<{ prices: any[] }>('/api/admin/stripe-prices')
    // Keep local display name/desc for prices we already have; fill new ones from Stripe.
    const localById = new Map(plans.value.map((p: any) => [p.priceId, p]))
    plans.value = (res.prices || []).map((p) => {
      const old = localById.get(p.priceId)
      return {
        key: old?.key || p.priceId,
        name: old?.name || p.productName || p.priceId,
        amount: old?.amount ?? (p.amount ? String(p.amount) : ''),
        priceType: old?.priceType || (p.interval === 'year' ? 'yearly' : 'monthly'),
        desc: old?.desc || '',
        priceId: p.priceId,
        enabled: old ? old.enabled !== false : true,
        highlighted: !!old?.highlighted,
      }
    })
    // Auto-persist to DB right after sync.
    await $fetch('/api/admin/settings', {
      method: 'POST',
      body: {
        googleClientId: googleClientId.value,
        googleClientSecret: googleClientSecret.value,
        stripeSecretKey: stripeSecretKey.value,
        stripePublishableKey: stripePublishableKey.value,
        stripeWebhookSecret: stripeWebhookSecret.value,
        freeEnabled: freeEnabled.value,
        freeName: freeName.value,
        freeDesc: freeDesc.value,
        plans: plans.value,
      }
    })
    await refreshCfg()
    credMsg.value = t('set.synced')
  } catch (e: any) {
    credMsg.value = e?.data?.statusMessage || 'Stripe not configured'
  } finally { syncing.value = false }
}
const credSaving = ref(false)
const credMsg = ref('')

function onPickLogo(e: Event) {
  logoError.value = ''
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) { logoError.value = t('on.logoType'); return }
  if (file.size > 300 * 1024) { logoError.value = t('on.logoSize'); return }
  const reader = new FileReader()
  reader.onload = () => { logo.value = reader.result as string }
  reader.readAsDataURL(file)
}

async function saveBrand() {
  saving.value = true
  msg.value = ''
  try {
    await $fetch('/api/admin/onboarding', { method: 'POST', body: { siteName: siteName.value, logo: logo.value, seoTitle: seoTitle.value, seoDescription: seoDescription.value, analyticsId: analyticsId.value, siteUrl: siteUrl.value, ogImage: ogImage.value } })
    await refresh()
    msg.value = '✓'
  } finally { saving.value = false }
}

async function saveCreds() {
  credSaving.value = true
  credMsg.value = ''
  try {
    await $fetch('/api/admin/settings', {
      method: 'POST',
      body: {
        googleClientId: googleClientId.value,
        googleClientSecret: googleClientSecret.value,
        stripeSecretKey: stripeSecretKey.value,
        stripePublishableKey: stripePublishableKey.value,
        stripeWebhookSecret: stripeWebhookSecret.value,
        freeEnabled: freeEnabled.value,
        freeName: freeName.value,
        freeDesc: freeDesc.value,
        plans: plans.value,
      }
    })
    googleClientSecret.value = ''
    stripeSecretKey.value = ''
    stripeWebhookSecret.value = ''
    await refreshCfg()
    await refresh()
    credMsg.value = t('set.saved')
  } finally { credSaving.value = false }
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div class="mb-6 flex gap-1 rounded-lg border border-border bg-muted/50 p-1">
      <button v-for="t in tabs" :key="t.key" class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors"
        :class="tab === t.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
        @click="tab = t.key">
        {{ t.label }}
      </button>
    </div>

    <!-- Brand tab -->
    <div v-if="tab === 'brand'" class="rounded-xl border border-border bg-card p-6">
      <h3 class="font-semibold">{{ t('set.brand') }}</h3>
      <p class="text-sm text-muted-foreground">{{ t('set.brandSub') }}</p>
      <div class="mt-6 space-y-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium">{{ t('on.siteName') }}</label>
          <input v-model="siteName" type="text" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">{{ t('on.logo') }}</label>
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
              <img v-if="logo" :src="logo" alt="logo" class="h-full w-full object-contain" />
              <span v-else class="flex h-full w-full items-center justify-center rounded-lg bg-primary text-base font-extrabold text-primary-foreground">{{ (siteName || 'L').charAt(0).toUpperCase() }}</span>
            </div>
            <div>
              <label class="cursor-pointer rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">
                {{ t('on.upload') }}
                <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" class="hidden" @change="onPickLogo" />
              </label>
              <p class="mt-1 text-xs text-muted-foreground">{{ t('on.logoHint') }}</p>
              <p v-if="logoError" class="mt-1 text-xs text-rose-500">{{ logoError }}</p>
            </div>
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">{{ t("set.seoTitle") }}</label>
          <input v-model="seoTitle" type="text" :placeholder="siteName" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">{{ t("set.seoDesc") }}</label>
          <textarea v-model="seoDescription" rows="2" placeholder="Shown in search results and social previews." class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"></textarea>
        </div>
        <div>
          <div class="mb-1.5 flex items-center justify-between">
            <label class="text-sm font-medium">{{ t("set.analytics") }}</label>
            <a href="https://analytics.google.com/analytics/web/" target="_blank" class="text-xs text-primary hover:underline">{{ t("set.applyAnalytics") }} →</a>
          </div>
          <input v-model="analyticsId" type="text" placeholder="G-XXXXXXXXXX" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">{{ t("set.siteUrl") }}</label>
          <input v-model="siteUrl" type="text" placeholder="https://yourapp.com" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
          <p class="mt-1 text-xs text-muted-foreground">{{ t("set.siteUrlHint") }}</p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">{{ t("set.ogImage") }}</label>
          <div class="flex items-center gap-3">
            <div class="h-16 w-28 overflow-hidden rounded border border-border bg-card">
              <img v-if="ogImage" :src="ogImage" alt="og" class="h-full w-full object-cover" />
            </div>
            <label class="cursor-pointer rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">
              上传
              <input type="file" accept="image/*" class="hidden" @change="onPickOg" />
            </label>
          </div>
        </div>
        <div class="flex justify-end">
          <button @click="saveBrand" :disabled="saving" class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {{ saving ? t('common.loading') : t('common.save') }} <span v-if="msg">{{ msg }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Auth tab -->
    <div v-else-if="tab === 'auth'" class="rounded-xl border border-border bg-card p-6">
      <h3 class="font-semibold">{{ t('set.auth') }}</h3>
      <p class="text-sm text-muted-foreground">{{ t('set.authSub') }}</p>
      <div class="mt-6 space-y-4">
        <div>
          <div class="mb-1.5 flex items-center justify-between">
            <label class="text-sm font-medium">{{ t("set.googleId") }}</label>
            <a href="https://console.cloud.google.com/apis/credentials" target="_blank" class="text-xs text-primary hover:underline">{{ t("set.applyGoogle") }} →</a>
          </div>
          <input v-model="googleClientId" type="text" placeholder="xxxxxxxx.apps.googleusercontent.com" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">{{ t("set.googleSecret") }}</label>
          <input v-model="googleClientSecret" type="password" :placeholder="cfg?.googleConfigured ? '••••••••' : 'GOCSPX-…'" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
      </div>
    </div>

    <!-- Payment tab -->
    <div v-else class="rounded-xl border border-border bg-card p-6">
      <h3 class="font-semibold">{{ t('set.payment') }}</h3>
      <p class="text-sm text-muted-foreground">{{ t('set.paymentSub') }}</p>
      <div class="mt-6 space-y-4">
        <div>
          <div class="mb-1.5 flex items-center justify-between">
            <label class="text-sm font-medium">{{ t("set.stripeSecret") }}</label>
            <a href="https://dashboard.stripe.com/apikeys" target="_blank" class="text-xs text-primary hover:underline">{{ t("set.applyStripe") }} →</a>
          </div>
          <input v-model="stripeSecretKey" type="password" :placeholder="cfg?.stripeConfigured ? '••••••••' : 'sk_test_…'" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">{{ t("set.stripePublishable") }}</label>
          <input v-model="stripePublishableKey" type="text" placeholder="pk_test_…" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">{{ t("set.webhookSecret") }}</label>
          <input v-model="stripeWebhookSecret" type="password" placeholder="whsec_…" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>

        <div class="mt-6 border-t border-border pt-5">
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-semibold">{{ t('set.plans') }}</p>
            <div class="flex gap-2">
              <button class="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted" @click="syncFromStripe">
                {{ syncing ? '…' : t('set.syncStripe') }}
              </button>
            </div>
          </div>
          <label class="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <input v-model="freeEnabled" type="checkbox" class="h-4 w-4" />
            {{ t('set.freePlanEnabled') }}
          </label>
          <div v-if="freeEnabled" class="mb-4 rounded-lg border border-dashed border-border p-4">
            <div class="space-y-3">
              <div>
                <label class="mb-1 block text-xs text-muted-foreground">{{ t('set.freeName') }}</label>
                <input v-model="freeName" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label class="mb-1 block text-xs text-muted-foreground">{{ t('set.freeDesc') }}</label>
                <textarea v-model="freeDesc" rows="2" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"></textarea>
              </div>
            </div>
          </div>
          <div v-for="(p, i) in plans" :key="i" class="mb-4 rounded-lg border border-border p-4">
            <div class="mb-3 flex items-center justify-between">
              <span class="text-xs font-medium text-muted-foreground">{{ t('set.plan') }} #{{ i + 1 }}</span>
              <div class="flex items-center gap-3">
                <label class="flex items-center gap-2 text-xs text-muted-foreground">
                  <input v-model="p.enabled" type="checkbox" class="h-4 w-4" />
                  {{ t('set.enabled') }}
                </label>
                <label class="flex items-center gap-2 text-xs text-muted-foreground">
                  <input v-model="p.highlighted" type="checkbox" class="h-4 w-4" @change="onHighlight(i)" />
                  {{ t('set.highlight') }}
                </label>
                <button class="text-xs text-rose-500 hover:underline" @click="removePlan(i)">{{ t('set.removePlan') }}</button>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div class="sm:col-span-2">
                <label class="mb-1 block text-xs text-muted-foreground">{{ t('set.planName') }}</label>
                <input v-model="p.name" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label class="mb-1 block text-xs text-muted-foreground">{{ t('set.planType') }}</label>
                <select v-model="p.priceType" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40">
                  <option value="free">{{ t('set.free') }}</option>
                  <option value="monthly">{{ t('set.monthly') }}</option>
                  <option value="yearly">{{ t('set.yearly') }}</option>
                  <option value="lifetime">{{ t('set.lifetime') }}</option>
                </select>
              </div>
            </div>
            <div v-if="p.priceType !== 'free'" class="mt-3">
              <label class="mb-1 block text-xs text-muted-foreground">{{ t('set.amount') }}</label>
              <input v-model="p.amount" placeholder="19.90" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div class="mt-3">
              <label class="mb-1 block text-xs text-muted-foreground">{{ t('set.planDesc') }}</label>
              <textarea v-model="p.desc" rows="2" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"></textarea>
            </div>
            <div class="mt-3">
              <label class="mb-1 block text-xs text-muted-foreground">{{ t("set.priceId") }}</label>
              <input v-model="p.priceId" placeholder="price_…" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="tab !== 'brand'" class="mt-6 flex items-center justify-end gap-3">
      <p v-if="credMsg" class="text-xs font-medium text-emerald-600">{{ credMsg }}</p>
      <button @click="saveCreds" :disabled="credSaving" class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
        {{ credSaving ? t('common.loading') : t('set.saveCreds') }}
      </button>
    </div>
  </div>
</template>
