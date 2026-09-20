<script setup lang="ts">
definePageMeta({ layout: 'docs' })
const { t } = useI18n()
</script>

<template>
  <div>
    <h1 class="text-4xl font-bold tracking-tight">{{ t('d.docs_docker2') }}</h1>
    <div class="mt-4 rounded-xl bg-zinc-950 p-4"><code class="text-sm text-zinc-100">docker compose up -d --build</code></div>
    <h2 class="mt-10 text-2xl font-semibold tracking-tight">{{ t('d.docs_prod') }}</h2>
    <p class="mt-4 text-sm text-muted-foreground">Point your reverse proxy at port 3000.</p>
  </div>
</template>
