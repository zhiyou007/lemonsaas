<script setup lang="ts">
definePageMeta({ layout: 'docs' })
const { t } = useI18n()
</script>

<template>
  <div>
    <h1 class="text-4xl font-bold tracking-tight">{{ t('d.docs_quick') }}</h1>
    <h2 class="mt-10 text-2xl font-semibold tracking-tight">{{ t('d.docs_start') }}</h2>
    <div class="mt-4 rounded-xl bg-zinc-950 p-4"><code class="text-sm text-zinc-100">docker compose up -d --build</code></div>
    <h2 class="mt-10 text-2xl font-semibold tracking-tight">{{ t('d.docs_next') }}</h2>
    <p class="mt-4 text-sm text-muted-foreground">Settings → Brand, configure keys, add blog posts.</p>
  </div>
</template>
