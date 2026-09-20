<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
const { t } = useI18n()
const { data, refresh } = await useFetch('/api/admin/blog', { key: 'admin-blog' })
const editing = ref<any>(null)
const saving = ref(false)
const ta = ref<HTMLTextAreaElement | null>(null)

function newPost() {
  editing.value = { title: '', slug: '', excerpt: '', content: '', published: true }
}
function wrap(before: string, after = '') {
  const el = ta.value
  if (!el || !editing.value) return
  const s = el.selectionStart
  const e = el.selectionEnd
  const selected = editing.value.content.slice(s, e)
  editing.value.content = editing.value.content.slice(0, s) + before + selected + after + editing.value.content.slice(e)
}
function insertImage() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    const file = input.files?.[0]
    if (!file) return
    if (file.size > 500 * 1024) { alert('Image must be under 500 KB'); return }
    const r = new FileReader()
    r.onload = () => { editing.value.content += `\n\n![image](${r.result})\n\n` }
    r.readAsDataURL(file)
  }
  input.click()
}
async function save() {
  saving.value = true
  await $fetch('/api/admin/blog', { method: 'POST', body: editing.value })
  editing.value = null
  await refresh()
  saving.value = false
}
async function del(id: string) {
  await $fetch('/api/admin/blog/' + id, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">{{ t('blog.title') }}</h2>
      <button class="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground" @click="newPost">{{ t('blog.new') }}</button>
    </div>

    <div v-if="editing" class="mt-6 space-y-3 rounded-xl border border-border bg-card p-6">
      <input v-model="editing.title" :placeholder="t('blog.titleLabel')" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
      <input v-model="editing.slug" :placeholder="t('blog.slug')" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
      <input v-model="editing.excerpt" :placeholder="t('blog.excerpt')" class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
      <div class="rounded-md border border-border">
        <div class="flex flex-wrap gap-1 border-b border-border bg-muted/50 p-1.5">
          <button class="rounded px-2 py-1 text-xs font-bold hover:bg-muted" @click="wrap('**', '**')">B</button>
          <button class="rounded px-2 py-1 text-xs italic hover:bg-muted" @click="wrap('*', '*')">I</button>
          <button class="rounded px-2 py-1 text-xs font-semibold hover:bg-muted" @click="wrap('## ')">H2</button>
          <button class="rounded px-2 py-1 text-xs hover:bg-muted" @click="wrap('```', '\n```')">code</button>
          <button class="rounded px-2 py-1 text-xs hover:bg-muted" @click="wrap('[', '](url)')">link</button>
          <button class="rounded px-2 py-1 text-xs hover:bg-muted" @click="insertImage">Img</button>
        </div>
        <textarea ref="ta" v-model="editing.content" rows="12" :placeholder="t('blog.content')" class="w-full rounded-b-md bg-background px-3 py-2 font-mono text-sm outline-none"></textarea>
      </div>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="editing.published" type="checkbox" /> {{ t('blog.published') }}
      </label>
      <div class="flex justify-end gap-2">
        <button class="rounded-md border border-border px-3 py-2 text-sm" @click="editing = null">{{ t('blog.cancel') }}</button>
        <button class="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground" @click="save">{{ saving ? '…' : t('blog.save') }}</button>
      </div>
    </div>

    <div class="mt-6 space-y-3">
      <div v-for="p in data?.posts || []" :key="p.id" class="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <div>
          <p class="font-medium">{{ p.title }} <span class="ml-2 text-xs text-muted-foreground">{{ p.published ? t('blog.published') : t('blog.draft') }}</span></p>
          <p class="text-xs text-muted-foreground">/blog/{{ p.slug }}</p>
        </div>
        <div class="flex gap-2">
          <button class="text-sm text-primary hover:underline" @click="editing = { ...p }">{{ t('blog.edit') }}</button>
          <button class="text-sm text-rose-500 hover:underline" @click="del(p.id)">{{ t('common.delete') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
