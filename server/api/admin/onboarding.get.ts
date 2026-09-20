export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user || !user.isAdmin) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  const settings = await prisma.setting.findMany()
  const map: Record<string, string> = {}
  for (const s of settings) map[s.key] = s.value

  const [gId, gSec, sKey, sPrice] = await Promise.all([
    getSetting(SETTING_KEYS.googleClientId, process.env.GOOGLE_CLIENT_ID || ''),
    getSetting(SETTING_KEYS.googleClientSecret, process.env.GOOGLE_CLIENT_SECRET || ''),
    getSetting(SETTING_KEYS.stripeSecretKey, process.env.STRIPE_SECRET_KEY || ''),
    getSetting(SETTING_KEYS.stripePricePro, process.env.STRIPE_PRICE_PRO_ID || ''),
  ])
  return {
    completed: map['onboarding.completed'] === 'true',
    siteName: map['site.name'] || 'Lumen',
    logo: map['site.logo'] || '',
    seoTitle: map['seo.title'] || '',
    seoDescription: map['seo.description'] || '',
    analyticsId: map['analytics.gaId'] || '',
    siteUrl: map['site.url'] || '',
    ogImage: map['site.ogImage'] || '',
    googleConfigured: Boolean(gId && gSec),
    stripeConfigured: Boolean(sKey && sPrice),
    hasUsers: true,
    adminEmail: user.email
  }
})
