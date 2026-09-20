<script setup lang="ts">
import ThemeToggle from '~/components/ThemeToggle.vue'
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
import { useI18n } from '~/composables/useI18n'
const { t } = useI18n()
const { mobileOpen } = useUi()
const router = useRouter()
const route = useRoute()
const { isLoading } = useLoadingIndicator()
async function refreshPage() {
  // Hard reload so all page data is actually refetched; browser shows loading.
  if (isLoading.value) return
  window.location.reload()
}
const title = computed(() => {
  const p = route.path
  if (p.includes('profile')) return t('nav.profile')
  if (p.includes('onboarding')) return t('nav.setup')
  if (p.includes('admin')) return t('topbar.admin')
  if (p.includes('projects')) return t('nav.projects')
  if (p.includes('billing')) return t('topbar.billing')
  if (p.includes('settings')) return t('topbar.settings')
  return t('topbar.dashboard')
})
</script>

<template>
  <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur sm:px-6 lg:px-8">
    <div class="flex items-center gap-3">
      <button class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground md:hidden" @click="mobileOpen = true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
      <button class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" :class="isLoading && 'text-primary'" title="刷新" @click="refreshPage">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="isLoading && 'animate-spin'">
          <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5"/>
        </svg>
      </button>
      <h1 class="text-lg font-semibold tracking-tight">{{ title }}</h1>
    </div>
    <div class="flex items-center gap-3">
      <LanguageSwitcher />
      <ThemeToggle size="sm" />
    </div>
  </header>
</template>
