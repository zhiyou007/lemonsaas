export function renderMarkdown(md: string): string {
  if (!md) return ''
  let s = md
  s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  s = s.replace(/^### (.*)$/gm, '<h3 class="mt-6 text-xl font-semibold">$1</h3>')
  s = s.replace(/^## (.*)$/gm, '<h2 class="mt-8 text-2xl font-semibold tracking-tight">$1</h2>')
  s = s.replace(/^# (.*)$/gm, '<h1 class="mt-8 text-3xl font-bold">$1</h1>')
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>')
  s = s.replace(/`(.+?)`/g, '<code class="rounded bg-muted px-1.5 py-0.5 text-sm">$1</code>')
  s = s.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
  s = s.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="my-4 rounded-lg border border-border" />')
  s = s.replace(/\n\n/g, '</p><p class="mt-4">')
  return '<p class="leading-relaxed">' + s + '</p>'
}
