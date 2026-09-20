<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const { t } = useI18n()
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/signup', { method: 'POST', body: { name: name.value, email: email.value, password: password.value } })
    await router.push('/dashboard')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Error'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="rounded-xl border border-border bg-card p-8 shadow-sm">
    <h1 class="text-2xl font-bold tracking-tight">{{ t('signup.title') }}</h1>
    <p class="mt-1 text-sm text-muted-foreground">{{ t('signup.subtitle') }}</p>

    <form class="mt-6 space-y-4" @submit.prevent="submit">
      <div>
        <label class="mb-1.5 block text-sm font-medium" for="name">{{ t('signup.name') }}</label>
        <input id="name" v-model="name" type="text" required autocomplete="name"
          class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium" for="email">{{ t('signup.email') }}</label>
        <input id="email" v-model="email" type="email" required autocomplete="email"
          class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium" for="password">{{ t('signup.password') }}</label>
        <input id="password" v-model="password" type="password" required minlength="8" autocomplete="new-password"
          class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
      </div>

      <p v-if="error" class="rounded-md bg-rose-500/10 px-3 py-2 text-sm text-rose-500">{{ error }}</p>

      <button type="submit" :disabled="loading"
        class="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
        {{ loading ? t('signup.creating') : t('signup.create') }}
      </button>
    </form>

    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-border"></div></div>
      <div class="relative flex justify-center text-xs"><span class="bg-card px-2 text-muted-foreground">{{ t('login.or') }}</span></div>
    </div>

    <a href="/api/auth/google"
      class="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background py-2.5 text-sm font-semibold hover:bg-muted">
      <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 010-4.2V7.06H2.18a11 11 0 000 9.88l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 002.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
      {{ t('login.continueGoogle') }}
    </a>

    <p class="mt-6 text-center text-sm text-muted-foreground">
      {{ t('signup.haveAccount') }}
      <NuxtLink to="/login" class="font-medium text-primary hover:underline">{{ t('signup.signin') }}</NuxtLink>
    </p>
  </div>
</template>
