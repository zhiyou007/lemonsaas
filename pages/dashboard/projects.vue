<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
import { useI18n } from '~/composables/useI18n'
const { t, locale } = useI18n()

const list = ref<any[]>([])
const loading = ref(true)
const showForm = ref(false)
const name = ref('')
const description = ref('')
const creating = ref(false)

const { data, refresh } = await useFetch('/api/projects', { key: 'projects' })
watch(data, (v) => { list.value = v?.projects || []; loading.value = false }, { immediate: true })

async function create() {
  creating.value = true
  try {
    await $fetch('/api/projects', { method: 'POST', body: { name: name.value, description: description.value } })
    showForm.value = false
    name.value = ''
    description.value = ''
    await refresh()
  } finally {
    creating.value = false
  }
}
async function remove(id: string) {
  if (!confirm(t('projects.confirmDelete'))) return
  await $fetch(`/api/projects/${id}`, { method: 'DELETE' })
  await refresh()
}
function fmt(d: string) {
  return new Date(d).toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US')
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold">{{ t('projects.title') }}</h2>
        <p class="mt-1 text-sm text-muted-foreground">{{ t('projects.sub') }}</p>
      </div>
      <button class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90" @click="showForm = !showForm">
        + {{ t('projects.new') }}
      </button>
    </div>

    <form v-if="showForm" class="space-y-4 rounded-xl border border-border bg-card p-6">
      <div>
        <label class="mb-1.5 block text-sm font-medium">{{ t('projects.name') }}</label>
        <input v-model="name" type="text" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium">{{ t('projects.desc') }}</label>
        <textarea v-model="description" rows="2" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
      </div>
      <button type="button" :disabled="creating || !name" class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60" @click="create">
        {{ creating ? t('projects.creating') : t('projects.create') }}
      </button>
    </form>

    <div v-if="loading" class="text-sm text-muted-foreground">{{ t('common.loading') }}</div>
    <div v-else-if="list.length === 0" class="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
      {{ t('projects.empty') }}
    </div>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="p in list" :key="p.id" class="rounded-xl border border-border bg-card p-5">
        <div class="flex items-start justify-between">
          <h3 class="font-semibold">{{ p.name }}</h3>
          <span class="rounded-full px-2 py-0.5 text-xs" :class="p.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'">
            {{ p.status === 'active' ? t('projects.active') : t('projects.archived') }}
          </span>
        </div>
        <p class="mt-2 text-sm text-muted-foreground">{{ p.description || '—' }}</p>
        <div class="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>{{ t('projects.created') }}: {{ fmt(p.createdAt) }}</span>
          <button class="text-rose-500 hover:underline" @click="remove(p.id)">{{ t('common.delete') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
