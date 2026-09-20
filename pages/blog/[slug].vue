<script setup lang="ts">
import { renderMarkdown } from '~/utils/markdown'
const route = useRoute()
const { data: post } = await useFetch('/api/blog/' + route.params.slug, { key: 'blog-' + route.params.slug })
useHead(() => ({ title: (post.value?.title || 'Post') + ' — Lumen' }))
</script>

<template>
  <article class="mx-auto max-w-3xl px-4 py-20 sm:px-6">
    <NuxtLink to="/blog" class="text-sm text-muted-foreground hover:underline">← All posts</NuxtLink>
    <h1 class="mt-6 text-3xl font-bold tracking-tight">{{ post?.title }}</h1>
    <p class="mt-3 text-sm text-muted-foreground">{{ post ? new Date(post.createdAt).toLocaleDateString() : '' }}</p>
    <div class="mt-8 h-px bg-border"></div>
    <div class="mt-8 prose prose-neutral dark:prose-invert max-w-none leading-relaxed" v-html="post ? renderMarkdown(post.content) : ''"></div>
  </article>
</template>
