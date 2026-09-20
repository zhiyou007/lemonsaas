<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
import { useAuth } from '~/composables/useAuth'
const { user } = useAuth()
const { t } = useI18n()
await useAuth().refresh()
const { data: site } = await useFetch('/api/site', { key: 'site' })
const links = computed(() => [
  { label: t('nav.features'), href: '/#features' },
  { label: t('nav.pricing'), href: '/#pricing' },
  { label: t('nav.blog'), href: '/blog' },
  { label: t('nav.docs'), href: '/docs/intro' },
  { label: t('nav.faq'), href: '/#faq' }
])
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <NuxtLink to="/" class="flex items-center gap-2 font-bold text-foreground">
        <img v-if="site?.logo" :src="site.logo" alt="logo" class="h-7 w-7 object-contain" />
        <span v-else class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground">L</span>
        <span class="text-lg tracking-tight">{{ site?.name || 'Lumen' }}</span>
      </NuxtLink>

      <nav class="hidden items-center gap-8 md:flex">
        <a v-for="l in links" :key="l.label" :href="l.href" class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{{ l.label }}</a>
      </nav>

      <div class="flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle size="sm" />
        <template v-if="user">
          <NuxtLink to="/dashboard" class="rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">{{ t("nav.dashboard") }}</NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline">{{ t('nav.signin') }}</NuxtLink>
          <NuxtLink to="/signup" class="rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">{{ t('nav.getStarted') }}</NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>
