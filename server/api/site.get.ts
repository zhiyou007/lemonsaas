import { getSetting } from '~/server/utils/settings'

export default defineEventHandler(async () => {
  return {
    siteName: await getSetting('site.name', 'Lumen'),
    logo: await getSetting('site.logo', ''),
    seoTitle: await getSetting('seo.title', ''),
    seoDescription: await getSetting('seo.description', ''),
    analyticsId: await getSetting('analytics.gaId', ''),
    siteUrl: await getSetting('site.url', ''),
    ogImage: await getSetting('site.ogImage', ''),
  }
})
