// Allowlist-based HTML sanitizer. Strips scripts, event handlers, and unsafe URLs.
const ALLOWED_TAGS = new Set(['p','br','b','strong','i','em','u','s','h1','h2','h3','h4','ul','ol','li','blockquote','a','code','pre','span','div','img'])
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href']),
  img: new Set(['src','alt']),
}
const SAFE_PROTOCOLS = ['https:', 'http:', 'mailto:', '/', '#']

export function sanitizeHtml(dirty: string): string {
  const doc = new DOMParser().parseFromString(dirty, 'text/html')
  const walk = (node: ChildNode): string => {
    if (node.nodeType === 3) return node.textContent || ''
    if (node.nodeType !== 1) return ''
    const el = node as HTMLElement
    const tag = el.tagName.toLowerCase()
    if (!ALLOWED_TAGS.has(tag)) {
      // drop element but keep children
      return Array.from(el.childNodes).map(walk).join('')
    }
    let out = `<${tag}`
    const attrs = ALLOWED_ATTRS[tag] || new Set()
    for (const name of Array.from(el.attributes || []).map(a => a.name)) {
      if (!attrs.has(name)) continue
      let v = el.getAttribute(name) || ''
      if (name === 'href' || name === 'src') {
        if (!SAFE_PROTOCOLS.some(p => v.startsWith(p))) continue
      }
      out += ` ${name}="${v.replace(/"/g, '&quot;')}"`
    }
    out += '>' + Array.from(el.childNodes).map(walk).join('') + `</${tag}>`
    return out
  }
  return Array.from(doc.body.childNodes).map(walk).join('')
}
