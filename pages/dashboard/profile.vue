<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
import { useAuth } from '~/composables/useAuth'
import { useI18n } from '~/composables/useI18n'
const { user, refresh } = useAuth()
const { t } = useI18n()
await refresh()

const name = ref(user.value?.name || '')
const email = ref(user.value?.email || '')

const currentPassword = ref('')
const newPassword = ref('')
const pwMsg = ref('')
const pwError = ref('')
const pwLoading = ref(false)

async function changePassword() {
  pwError.value = ''
  pwMsg.value = ''
  pwLoading.value = true
  try {
    await $fetch('/api/auth/password', {
      method: 'POST',
      body: { currentPassword: currentPassword.value, newPassword: newPassword.value }
    })
    pwMsg.value = '✓'
    currentPassword.value = ''
    newPassword.value = ''
  } catch (e: any) {
    pwError.value = e?.data?.statusMessage || 'Error'
  } finally {
    pwLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <div class="rounded-xl border border-border bg-card p-6">
      <h3 class="font-semibold">{{ t('settings.profile') }}</h3>
      <p class="text-sm text-muted-foreground">{{ t('settings.profileSub') }}</p>
      <div class="mt-6 space-y-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium">{{ t('settings.name') }}</label>
          <input v-model="name" type="text" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">{{ t('settings.email') }}</label>
          <input v-model="email" type="email" disabled class="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground" />
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-border bg-card p-6">
      <h3 class="font-semibold">{{ t('settings.changePassword') }}</h3>
      <form class="mt-6 space-y-4" @submit.prevent="changePassword">
        <div>
          <label class="mb-1.5 block text-sm font-medium">{{ t('settings.currentPassword') }}</label>
          <input v-model="currentPassword" type="password" required class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">{{ t('settings.newPassword') }}</label>
          <input v-model="newPassword" type="password" required minlength="8" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div class="flex items-center gap-3">
          <button type="submit" :disabled="pwLoading" class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {{ pwLoading ? t('settings.saving') : t('settings.changePassword') }}
          </button>
          <span v-if="pwMsg" class="text-sm text-emerald-600">{{ pwMsg }}</span>
          <span v-if="pwError" class="text-sm text-rose-500">{{ pwError }}</span>
        </div>
      </form>
    </div>

    <div class="rounded-xl border border-rose-500/30 bg-card p-6">
      <h3 class="font-semibold text-rose-500">{{ t('settings.danger') }}</h3>
      <p class="mt-1 text-sm text-muted-foreground">{{ t('settings.dangerSub') }}</p>
      <button class="mt-4 rounded-md border border-rose-500/40 px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-500/10">{{ t('settings.deleteAccount') }}</button>
    </div>
  </div>
</template>
