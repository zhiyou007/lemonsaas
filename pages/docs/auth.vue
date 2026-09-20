<script setup lang="ts">
definePageMeta({ layout: 'docs' })
const { t } = useI18n()
</script>

<template>
  <div>
    <h1 class="text-4xl font-bold tracking-tight">{{ t('d.docs_auth') }}</h1>
    <h2 class="mt-10 text-2xl font-semibold tracking-tight">{{ t('d.docs_googlesetup') }}</h2>
    <p class="mt-4 text-sm text-muted-foreground">Configure Client ID and Secret in Settings → Login.</p>
  </div>
</template>
