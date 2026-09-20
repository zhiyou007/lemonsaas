<script setup lang="ts">
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
const editorEl = ref<HTMLElement | null>(null)

function cmd(c: string, arg?: string) {
  document.execCommand(c, false, arg)
  sync()
}
function insertImage(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 500 * 1024) { alert('Image must be under 500 KB'); return }
  const reader = new FileReader()
  reader.onload = () => {
    document.execCommand('insertHTML', false, `<img src="${reader.result}" alt="" style="max-width:100%" />`)
    sync()
  }
  reader.readAsDataURL(file)
}
function sync() {
  if (editorEl.value) emit('update:modelValue', editorEl.value.innerHTML)
}
onMounted(() => {
  if (editorEl.value) editorEl.value.innerHTML = props.modelValue || ''
})
watch(() => props.modelValue, (v) => {
  if (editorEl.value && editorEl.value.innerHTML !== v) editorEl.value.innerHTML = v || ''
})
</script>

<template>
  <div class="rounded-md border border-border">
    <div class="flex flex-wrap gap-1 border-b border-border bg-muted/50 p-1.5">
      <button class="rounded px-2 py-1 text-xs font-bold hover:bg-muted" @mousedown.prevent @click="cmd('bold')">B</button>
      <button class="rounded px-2 py-1 text-xs italic hover:bg-muted" @mousedown.prevent @click="cmd('italic')">I</button>
      <button class="rounded px-2 py-1 text-xs underline hover:bg-muted" @mousedown.prevent @click="cmd('underline')">U</button>
      <span class="w-px bg-border"></span>
      <button class="rounded px-2 py-1 text-xs font-semibold hover:bg-muted" @mousedown.prevent @click="cmd('formatBlock','h2')">H2</button>
      <button class="rounded px-2 py-1 text-xs font-semibold hover:bg-muted" @mousedown.prevent @click="cmd('formatBlock','h3')">H3</button>
      <button class="rounded px-2 py-1 text-xs hover:bg-muted" @mousedown.prevent @click="cmd('formatBlock','blockquote')">❝</button>
      <span class="w-px bg-border"></span>
      <button class="rounded px-2 py-1 text-xs hover:bg-muted" @mousedown.prevent @click="cmd('insertUnorderedList')">• List</button>
      <button class="rounded px-2 py-1 text-xs hover:bg-muted" @mousedown.prevent @click="cmd('insertOrderedList')">1. List</button>
      <span class="w-px bg-border"></span>
      <button class="rounded px-2 py-1 text-xs hover:bg-muted" @mousedown.prevent @click="cmd('createLink', prompt('URL:') || '')">Link</button>
      <label class="cursor-pointer rounded px-2 py-1 text-xs hover:bg-muted">
        Img
        <input type="file" accept="image/*" class="hidden" @change="insertImage" />
      </label>
      <button class="rounded px-2 py-1 text-xs hover:bg-muted" @mousedown.prevent @click="cmd('removeFormat')">Clear</button>
    </div>
    <div
      ref="editorEl"
      contenteditable="true"
      class="min-h-[200px] w-full rounded-b-md bg-background px-3 py-2 text-sm outline-none prose-sm max-w-none"
      @input="sync"
    />
  </div>
</template>
