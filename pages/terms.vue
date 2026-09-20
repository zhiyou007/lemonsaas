<script setup lang="ts">
const { t } = useI18n()
useHead(() => ({ title: t('legal.terms_title') + ' — Lumen' }))
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-24 sm:px-6">
    <h1 class="text-3xl font-bold tracking-tight">{{ t('legal.terms_title') }}</h1>
    <div class="mt-8 space-y-6 text-sm leading-relaxed">
      <p>{{ t('legal.terms_p1') }}</p>
      <h2 class="text-lg font-semibold">{{ t('legal.terms_h1') }}</h2>
      <p>{{ t('legal.terms_h1d') }}</p>
      <h2 class="text-lg font-semibold">{{ t('legal.terms_h2') }}</h2>
      <p>{{ t('legal.terms_h2d') }}</p>
    </div>
  </div>
</template>
