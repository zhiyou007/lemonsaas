<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from '~/composables/useI18n'
import { useUi } from '~/composables/useUi'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { openTabs, closeTab, labelFor, openTab } = useUi()

function active(path: string) { return route.path === path }
</script>

<template>
  <div class="flex items-center gap-1 overflow-x-auto border-b border-border bg-card px-4 pt-2 sm:px-6">
    <button
      v-for="tab in openTabs"
      :key="tab"
      class="group flex shrink-0 items-center gap-2 rounded-t-md border border-b-0 px-3 py-1.5 text-xs font-medium transition-colors"
      :class="active(tab) ? 'border-border bg-background text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
      @click="openTab(tab); router.push(tab)"
    >
      {{ t(labelFor(tab)) }}
      <span
        v-if="openTabs.length > 1"
        class="flex h-4 w-4 items-center justify-center rounded hover:bg-muted"
        @click.stop="closeTab(tab, route.path, router)"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </span>
    </button>
  </div>
</template>
