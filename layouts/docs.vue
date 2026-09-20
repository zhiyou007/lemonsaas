<script setup lang="ts">
const { t } = useI18n()
useHead(() => ({ title: t('nav.docs') + ' — Lumen' }))
const sections = computed(() => [
  { title: t('docs_sec_start'), items: [
    { slug: 'intro', label: t('d.docs_intro') },
    { slug: 'quickstart', label: t('d.docs_quick') },
  ]},
  { title: t('docs_sec_core'), items: [
    { slug: 'auth', label: t('d.docs_auth') },
    { slug: 'billing', label: t('d.docs_billing2') },
    { slug: 'seo', label: t('d.docs_seo2') },
  ]},
  { title: t('docs_sec_deploy'), items: [
    { slug: 'docker', label: t('d.docs_docker2') },
  ]},
])
const route = useRoute()
const active = route.params.slug || 'intro'
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppNavbar />
    <div class="mx-auto flex max-w-6xl gap-10 px-4 pt-12 sm:px-6">
      <aside class="hidden w-60 shrink-0 md:block">
        <div class="sticky top-24">
          <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{{ t('nav.docs') }}</p>
          <div v-for="s in sections" :key="s.title" class="mt-6">
            <p class="text-xs font-semibold uppercase tracking-wide text-foreground/70">{{ s.title }}</p>
            <ul class="mt-2 space-y-0.5">
              <li v-for="i in s.items" :key="i.slug">
                <NuxtLink
                  :to="`/docs/${i.slug}`"
                  class="block rounded-lg px-3 py-1.5 text-sm transition-colors"
                  :class="active === i.slug ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
                >{{ i.label }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </aside>
      <main class="min-w-0 flex-1 pb-20">
        <slot />
      </main>
    </div>
    <AppFooter />
  </div>
</template>
