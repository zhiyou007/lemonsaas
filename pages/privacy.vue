<script setup lang="ts">
const { t } = useI18n()
useHead(() => ({ title: t('legal.privacy_title') + ' — Lumen' }))
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-24 sm:px-6">
    <h1 class="text-3xl font-bold tracking-tight">{{ t('legal.privacy_title') }}</h1>
    <p class="mt-2 text-sm text-muted-foreground">{{ t('legal.privacy_updated') }}</p>
    <div class="mt-8 space-y-6 text-sm leading-relaxed">
      <p>{{ t('legal.privacy_p1') }}</p>
      <h2 class="text-lg font-semibold">{{ t('legal.privacy_h1') }}</h2>
      <p>{{ t('legal.privacy_h1d') }}</p>
      <h2 class="text-lg font-semibold">{{ t('legal.privacy_h2') }}</h2>
      <p>{{ t('legal.privacy_h2d') }}</p>
      <h2 class="text-lg font-semibold">{{ t('legal.privacy_h3') }}</h2>
      <p>{{ t('legal.privacy_h3d') }}</p>
      <h2 class="text-lg font-semibold">{{ t('legal.privacy_h4') }}</h2>
      <p>{{ t('legal.privacy_h4d') }}</p>
    </div>
  </div>
</template>
