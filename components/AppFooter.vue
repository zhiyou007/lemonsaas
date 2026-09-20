<script setup lang="ts">
const { t } = useI18n()
const cols = computed(() => [
  { title: t('footer.product'), items: [
    { label: t('nav.features'), href: '/#features' },
    { label: t('nav.pricing'), href: '/#pricing' },
    { label: t('nav.blog'), to: '/blog' },
    { label: t('nav.docs'), to: '/docs/intro' },
  ]},
  { title: t('footer.company'), items: [
    { label: t('nav.blog'), to: '/blog' },
    { label: t('footer.contact'), href: 'mailto:hello@example.com' },
  ]},
  { title: t('footer.legal'), items: [
    { label: t('landing.privacy'), to: '/privacy' },
    { label: t('landing.terms'), to: '/terms' },
  ]}
])
</script>

<template>
  <footer class="border-t border-border/60 bg-background">
    <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div class="grid gap-10 md:grid-cols-5">
        <div class="md:col-span-2">
          <div class="flex items-center gap-2 font-bold">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground">L</span>
            <span class="text-lg">Lumen</span>
          </div>
          <p class="mt-3 max-w-xs text-sm text-muted-foreground">{{ t('footer.tagline') }}</p>
        </div>
        <div v-for="col in cols" :key="col.title">
          <h4 class="text-sm font-semibold">{{ col.title }}</h4>
          <ul class="mt-3 space-y-2">
            <li v-for="item in col.items" :key="item.label">
              <NuxtLink v-if="item.to" :to="item.to" class="text-sm text-muted-foreground hover:text-foreground">{{ item.label }}</NuxtLink>
              <a v-else :href="item.href" class="text-sm text-muted-foreground hover:text-foreground">{{ item.label }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 sm:flex-row">
        <p class="text-xs text-muted-foreground">© 2026 Lumen Inc. {{ t('footer.rights') }}</p>
        <p class="text-xs text-muted-foreground">{{ t('footer.made') }}</p>
      </div>
    </div>
  </footer>
</template>
