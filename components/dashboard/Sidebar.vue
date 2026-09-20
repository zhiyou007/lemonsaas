<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useI18n } from '~/composables/useI18n'
import { useUi } from '~/composables/useUi'

const route = useRoute()
const router = useRouter()
const { user, logout } = useAuth()
const { t } = useI18n()
const { collapsed, toggleSidebar, mobileOpen, routes, openTab } = useUi()
const { data: site } = await useFetch('/api/site', { key: 'site' })

function go(to: string) {
  openTab(to)
  router.push(to)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="mobileOpen" class="fixed inset-0 z-40 bg-black/40 md:hidden" @click="mobileOpen = false" />
    <aside
      class="fixed inset-y-0 left-0 z-50 flex flex-col border-r border-r border-border bg-card transition-transform duration-200 md:z-30 md:translate-x-0 md:transition-[width]"
      :class="[mobileOpen ? 'translate-x-0' : '-translate-x-full', collapsed ? 'md:w-16' : 'md:w-64', 'w-64']"
    >
    <div class="flex h-16 items-center gap-2 border-b border-border px-4" :class="collapsed && 'justify-center px-0'">
      <img v-if="site?.logo" :src="site.logo" alt="logo" class="h-7 w-7 object-contain" />
      <span v-else class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground">L</span>
      <span v-if="!collapsed" class="font-bold tracking-tight">{{ site?.name || 'Lumen' }}</span>
    </div>

    <nav class="flex-1 space-y-1 p-3">
      <template v-for="item in routes.filter(n => !n.hideNav && (!n.adminOnly || user?.isAdmin))" :key="item.path">
        <div v-if="item.divider" class="my-2 border-t border-border"></div>
        <button
          class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
          :class="route.path === item.path ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
          :title="collapsed ? t(item.labelKey) : ''"
          @click="go(item.path)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path :d="item.icon" /></svg>
          <span v-if="!collapsed">{{ t(item.labelKey) }}</span>
        </button>
      </template>
    </nav>

    <div class="border-t border-border p-3">
      <div class="flex items-center gap-1">
        <button class="flex min-w-0 flex-1 items-center gap-3 rounded-md px-1 py-1 text-left transition-colors hover:bg-muted" :class="collapsed && 'justify-center'" @click="go('/dashboard/profile')">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
            {{ (user?.name || 'U').charAt(0) }}
          </div>
          <div v-if="!collapsed" class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium">{{ user?.name || 'Guest' }}</p>
            <p class="truncate text-xs text-muted-foreground">{{ user?.email }}</p>
          </div>
        </button>
        <button v-if="!collapsed" class="shrink-0 text-muted-foreground hover:text-foreground" :title="t('common.logout')" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
        </button>
      </div>
    </div>
    </aside>
  </Teleport>
</template>
