<script setup lang="ts">
import Sidebar from '~/components/dashboard/Sidebar.vue'
import Topbar from '~/components/dashboard/Topbar.vue'
import TabBar from '~/components/dashboard/TabBar.vue'
import OnboardingModal from '~/components/dashboard/OnboardingModal.vue'
import { useUi } from '~/composables/useUi'
import { useAuth } from '~/composables/useAuth'
import { useRoute } from 'vue-router'

const { collapsed, openTab, toggleSidebar } = useUi()
const { user, refresh } = useAuth()
const route = useRoute()
const showOnboarding = ref(false)
watch(() => route.path, (p) => { if (p.startsWith('/dashboard')) openTab(p) }, { immediate: true })

onMounted(async () => {
  await refresh()
  if (user.value?.isAdmin) {
    try {
      const res = await $fetch('/api/admin/onboarding')
      if (!res.completed) showOnboarding.value = true
    } catch {}
  }
})
</script>

<template>
  <div class="flex min-h-screen bg-muted/30">
    <Sidebar />
    <button
      class="fixed top-20 z-40 hidden h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-[left] duration-200 hover:text-foreground md:flex"
      :style="{ left: collapsed ? '64px' : '256px' }"
      @click="toggleSidebar"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path :d="collapsed ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'"/></svg>
    </button>
    <div class="flex flex-1 flex-col transition-[padding] duration-200" :class="collapsed ? 'md:pl-16' : 'md:pl-64'">
      <Topbar />
      <TabBar />
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
    <OnboardingModal :open="showOnboarding" @done="showOnboarding = false" />
  </div>
</template>
