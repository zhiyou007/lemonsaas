<script setup lang="ts">
const { t } = useI18n()
useHead(() => ({ title: t('nav.blog') + ' — Lumen' }))
const { data } = await useFetch('/api/blog', { key: 'blog' })
</script>

<template>
  <div>
    <div class="border-b border-border/60 bg-muted/30">
      <div class="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h1 class="text-4xl font-bold tracking-tight">{{ t("nav.blog") }}</h1>
        <p class="mt-3 text-lg text-muted-foreground">{{ t("blog.subtitle") }}</p>
      </div>
    </div>
    <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div class="space-y-6">
        <NuxtLink
          v-for="p in data?.posts || []"
          :key="p.id"
          :to="`/blog/${p.slug}`"
          class="block rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
        >
          <p class="text-xs text-muted-foreground">{{ new Date(p.createdAt).toLocaleDateString() }}</p>
          <h2 class="mt-2 text-xl font-semibold tracking-tight">{{ p.title }}</h2>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{{ p.excerpt }}</p>
        </NuxtLink>
        <p v-if="!data?.posts?.length" class="text-sm text-muted-foreground">{{ t("blog.empty") }}</p>
      </div>
    </div>
  </div>
</template>
