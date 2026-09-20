<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
const { t } = useI18n()
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'done'): void }>()

const { data, refresh } = await useFetch('/api/admin/onboarding', { key: 'onboarding' })
const step = ref(0)
const siteName = ref(data.value?.siteName || 'Lumen')
const logo = ref(data.value?.logo || '')
const logoError = ref('')
const saving = ref(false)

watch(() => props.open, (v) => { if (v) step.value = 0 })

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

const steps = computed(() => [
  { title: t('on.welcome') },
  { title: t('on.auth') },
  { title: t('on.payment') },
  { title: t('on.brand') }
])

async function next() {
  if (step.value === steps.value.length - 1) { await finish(); return }
  step.value++
}
async function finish() {
  saving.value = true
  try {
    await $fetch('/api/admin/onboarding', { method: 'POST', body: { siteName: siteName.value, logo: logo.value, completed: true } })
    await refresh()
    emit('done')
  } finally { saving.value = false }
}
async function skip() {
  await $fetch('/api/admin/onboarding', { method: 'POST', body: { completed: true } })
  emit('done')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div class="my-8 w-full max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <div class="mb-8 flex items-center justify-between">
          <div v-for="(s, i) in steps" :key="i" class="flex items-center">
            <div class="flex flex-col items-center">
              <div class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
                :class="i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'">
                {{ i < step ? '✓' : i + 1 }}
              </div>
              <p class="mt-1.5 hidden text-xs sm:block" :class="i === step ? 'font-medium text-foreground' : 'text-muted-foreground'">{{ s.title }}</p>
            </div>
            <div v-if="i < steps.length - 1" class="mx-2 mb-5 h-px w-10 sm:w-16" :class="i < step ? 'bg-emerald-500' : 'bg-border'"></div>
          </div>
        </div>

        <div v-if="step === 0">
          <h2 class="text-xl font-semibold">{{ t('on.welcomeTitle') }}</h2>
          <p class="mt-2 text-sm text-muted-foreground">{{ t('on.welcomeBody') }}</p>
        </div>
        <div v-else-if="step === 1">
          <h2 class="text-xl font-semibold">{{ t('on.authTitle') }}</h2>
          <p class="mt-2 text-sm text-muted-foreground">{{ t('on.authBody') }}</p>
          <div class="mt-6 space-y-3">
            <div class="flex items-center justify-between rounded-lg border border-border p-4">
              <div><p class="text-sm font-medium">Google {{ t('on.login') }}</p><p class="text-xs text-muted-foreground">{{ t('on.googleDesc') }}</p></div>
              <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="data?.googleConfigured ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'">
                {{ data?.googleConfigured ? t('on.configured') : t('on.missing') }}
              </span>
            </div>
            <div class="flex items-center justify-between rounded-lg border border-border p-4">
              <div><p class="text-sm font-medium">{{ t('on.emailPw') }}</p><p class="text-xs text-muted-foreground">{{ t('on.emailDesc') }}</p></div>
              <span class="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600">{{ t('on.configured') }}</span>
            </div>
          </div>
        </div>
        <div v-else-if="step === 2">
          <h2 class="text-xl font-semibold">{{ t('on.payTitle') }}</h2>
          <p class="mt-2 text-sm text-muted-foreground">{{ t('on.payBody') }}</p>
          <div class="mt-6 space-y-3">
            <div class="flex items-center justify-between rounded-lg border border-border p-4">
              <div><p class="text-sm font-medium">Stripe</p><p class="text-xs text-muted-foreground">{{ t('on.stripeDesc') }}</p></div>
              <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="data?.stripeConfigured ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'">
                {{ data?.stripeConfigured ? t('on.configured') : t('on.missing') }}
              </span>
            </div>
          </div>
        </div>
        <div v-else>
          <h2 class="text-xl font-semibold">{{ t('on.brandTitle') }}</h2>
          <p class="mt-2 text-sm text-muted-foreground">{{ t('on.brandBody') }}</p>
          <label class="mt-6 mb-1.5 block text-sm font-medium">{{ t('on.siteName') }}</label>
          <input v-model="siteName" type="text" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
          <label class="mt-6 mb-1.5 block text-sm font-medium">{{ t('on.logo') }}</label>
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
              <img v-if="logo" :src="logo" alt="logo" class="h-full w-full object-contain" />
              <span v-else class="flex h-full w-full items-center justify-center rounded-lg bg-primary text-base font-extrabold text-primary-foreground">
                {{ (siteName || 'L').charAt(0).toUpperCase() }}
              </span>
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

        <div class="mt-8 flex items-center justify-between">
          <button v-if="step > 0" class="text-sm text-muted-foreground hover:text-foreground" @click="step--">{{ t('on.back') }}</button>
          <button v-else class="text-sm text-muted-foreground hover:text-foreground" @click="skip">{{ t('on.skip') }}</button>
          <button class="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60" :disabled="saving" @click="next">
            {{ saving ? '…' : step === steps.length - 1 ? t('on.finish') : t('on.continue') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
