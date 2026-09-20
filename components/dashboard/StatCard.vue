<script setup lang="ts">
defineProps<{
  label: string
  value: string
  delta: number
  deltaLabel: string
  icon: string
}>()
</script>

<template>
  <div class="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
    <div class="flex items-center justify-between">
      <p class="text-sm font-medium text-muted-foreground">{{ label }}</p>
      <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="icon" /></svg>
      </span>
    </div>
    <p class="mt-3 text-2xl font-bold tracking-tight">{{ value }}</p>
    <p class="mt-1 text-xs" :class="delta >= 0 ? 'text-emerald-600' : 'text-rose-500'">
      {{ delta >= 0 ? '+' : '' }}{{ delta }}% {{ deltaLabel }}
    </p>
  </div>
</template>
