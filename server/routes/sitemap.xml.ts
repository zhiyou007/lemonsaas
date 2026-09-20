import { getSetting } from '~/server/utils/settings'

export default defineEventHandler(async () => {
  const url = (await getSetting('site.url', '')).replace(/\/$/, '') || 'http://localhost:3000'
  const urls = ['', '/privacy', '/terms', '/blog', '/docs/intro', '/login', '/signup'].map(p => `${url}${p}`)
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`
  setHeader(event, 'content-type', 'application/xml')
  return body
})
