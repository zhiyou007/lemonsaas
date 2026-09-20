<script setup lang="ts">
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
    <div class="absolute right-4 top-4">
      <LanguageSwitcher />
    </div>
    <div class="w-full max-w-sm">
      <NuxtLink to="/" class="mb-8 flex items-center justify-center gap-2 font-bold">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-base font-extrabold text-primary-foreground">L</span>
        <span class="text-xl tracking-tight">Lumen</span>
      </NuxtLink>
      <slot />
    </div>
  </div>
</template>
