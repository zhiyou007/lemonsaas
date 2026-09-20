<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{ size?: 'sm' | 'md' }>(), { size: 'md' })
const isDark = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})

function toggle() {
  const el = document.documentElement
  el.classList.toggle('dark')
  isDark.value = el.classList.contains('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
</script>

<template>
  <button
    class="inline-flex items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted"
    :class="props.size === 'sm' ? 'h-8 w-8' : 'h-9 w-9'"
    aria-label="Toggle theme"
    @click="toggle"
  >
    <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  </button>
</template>
