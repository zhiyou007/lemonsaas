<script setup lang="ts">
definePageMeta({ layout: 'docs' })
const { t } = useI18n()
</script>

<template>
  <div>
    <h1 class="text-4xl font-bold tracking-tight">{{ t('d.docs_billing2') }}</h1>
    <h2 class="mt-10 text-2xl font-semibold tracking-tight">{{ t('d.docs_billing2') }}</h2>
    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      <div class="rounded-xl border border-border bg-card p-4"><p class="font-medium">{{ t('d.docs_free') }}</p></div>
      <div class="rounded-xl border border-border bg-card p-4"><p class="font-medium">{{ t('d.docs_monthly') }}</p></div>
      <div class="rounded-xl border border-border bg-card p-4"><p class="font-medium">{{ t('d.docs_yearly') }}</p></div>
      <div class="rounded-xl border border-border bg-card p-4"><p class="font-medium">{{ t('d.docs_lifetime') }}</p></div>
    </div>
  </div>
</template>
