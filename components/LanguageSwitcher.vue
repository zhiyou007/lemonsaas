<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
const { locale, setLocale, locales } = useI18n()
</script>

<template>
  <select
    :value="locale"
    class="rounded-md border border-border bg-card px-2 py-1 text-xs outline-none"
    @change="setLocale(($event.target as HTMLSelectElement).value as any)"
  >
    <option v-for="l in locales" :key="l.code" :value="l.code">{{ l.label }}</option>
  </select>
</template>
