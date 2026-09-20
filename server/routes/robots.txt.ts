import { getSetting } from '~/server/utils/settings'

export default defineEventHandler(async () => {
  const url = (await getSetting('site.url', '')).replace(/\/$/, '')
  const sitemap = url ? `Sitemap: ${url}/sitemap.xml\n` : ''
  return `User-agent: *\nDisallow: /dashboard\nDisallow: /admin\nDisallow: /api\n${sitemap}`
})
