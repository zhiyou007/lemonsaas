<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
import { useAuth } from '~/composables/useAuth'
import { useI18n } from '~/composables/useI18n'
const { user, refresh } = useAuth()
const { t, locale } = useI18n()
await refresh()

const { data, pending, refresh: reload } = await useFetch('/api/admin/users', { key: 'admin-users' })

async function changePlan(id: string, plan: string) {
  await $fetch(`/api/admin/users/${id}`, { method: 'PATCH', body: { plan } })
  await reload()
}
async function removeUser(id: string) {
  if (!confirm(t('admin.confirmDelete'))) return
  await $fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
  await reload()
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US')
}
</script>

<template>
  <div v-if="pending" class="text-sm text-muted-foreground">{{ t('common.loading') }}</div>
  <div v-else class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="rounded-xl border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">{{ t('admin.totalUsers') }}</p>
        <p class="mt-2 text-3xl font-bold">{{ data?.total }}</p>
      </div>
      <div class="rounded-xl border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">{{ t('admin.paidUsers') }}</p>
        <p class="mt-2 text-3xl font-bold">{{ data?.pro }}</p>
      </div>
    </div>

    <div class="rounded-xl border border-border bg-card">
      <div class="border-b border-border p-5">
        <h3 class="font-semibold">{{ t('admin.users') }}</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b border-border text-left text-muted-foreground">
            <tr>
              <th class="px-5 py-3 font-medium">{{ t('admin.name') }}</th>
              <th class="px-5 py-3 font-medium">{{ t('admin.email') }}</th>
              <th class="px-5 py-3 font-medium">{{ t('admin.role') }}</th>
              <th class="px-5 py-3 font-medium">{{ t('admin.plan') }}</th>
              <th class="px-5 py-3 font-medium">{{ t('admin.joined') }}</th>
              <th class="px-5 py-3 font-medium text-right">{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="u in data?.users" :key="u.id">
              <td class="px-5 py-3 font-medium">{{ u.name }}</td>
              <td class="px-5 py-3 text-muted-foreground">{{ u.email }}</td>
              <td class="px-5 py-3">
                <span class="rounded-full px-2 py-0.5 text-xs" :class="u.isAdmin ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'">
                  {{ u.isAdmin ? t('admin.admin') : t('admin.user') }}
                </span>
              </td>
              <td class="px-5 py-3">
                <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{{ u.planName }}</span>
              </td>
              <td class="px-5 py-3 text-muted-foreground">{{ fmtDate(u.createdAt) }}</td>
              <td class="px-5 py-3 text-right">
                <button v-if="u.id !== user?.id" class="text-xs text-rose-500 hover:underline" @click="removeUser(u.id)">{{ t('common.delete') }}</button>
                <span v-else class="text-xs text-muted-foreground">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
