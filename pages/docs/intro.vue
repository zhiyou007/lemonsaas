<script setup lang="ts">
definePageMeta({ layout: 'docs' })
const { t } = useI18n()
</script>

<template>
  <div>
    <h1 class="text-4xl font-bold tracking-tight">{{ t('d.docs_intro') }}</h1>
    <p class="mt-4 text-lg text-muted-foreground leading-relaxed">{{ t("d.docs_intro_body") }}</p>
    <h2 class="mt-10 text-2xl font-semibold tracking-tight">{{ t('d.docs_what') }}</h2>
    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      <div class="rounded-xl border border-border bg-card p-4"><p class="font-medium">{{ t("set.auth") }}</p><p class="mt-1 text-sm text-muted-foreground">Email + Google OAuth</p></div>
      <div class="rounded-xl border border-border bg-card p-4"><p class="font-medium">{{ t("set.payment") }}</p><p class="mt-1 text-sm text-muted-foreground">Stripe subscriptions</p></div>
      <div class="rounded-xl border border-border bg-card p-4"><p class="font-medium">{{ t("admin.title") }}</p><p class="mt-1 text-sm text-muted-foreground">{{ t("admin.users") }}</p></div>
      <div class="rounded-xl border border-border bg-card p-4"><p class="font-medium">SEO</p><p class="mt-1 text-sm text-muted-foreground">Sitemap, GA4, JSON-LD</p></div>
    </div>
  </div>
</template>
