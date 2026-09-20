import { SETTING_KEYS } from '~/server/utils/settings'

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user || !user.isAdmin) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  // Report only whether each key is set, not the secret values.
  const keys = Object.values(SETTING_KEYS)
  const rows = await prisma.setting.findMany({ where: { key: { in: keys } } })
  const db: Record<string, string> = {}
  for (const r of rows) db[r.key] = r.value

  const present = (key: string, envFallback: string) => Boolean(db[key] || envFallback)

  return {
    googleClientId: db[SETTING_KEYS.googleClientId] || process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: db[SETTING_KEYS.googleClientSecret] || process.env.GOOGLE_CLIENT_SECRET || '',
    googleConfigured: Boolean(db[SETTING_KEYS.googleClientId] || process.env.GOOGLE_CLIENT_ID),
    stripeSecretKey: db[SETTING_KEYS.stripeSecretKey] || process.env.STRIPE_SECRET_KEY || '',
    stripePublishableKey: db[SETTING_KEYS.stripePublishableKey] || process.env.STRIPE_PUBLISHABLE_KEY || '',
    stripeWebhookSecret: db[SETTING_KEYS.stripeWebhookSecret] || process.env.STRIPE_WEBHOOK_SECRET || '',
    stripeConfigured: Boolean(db[SETTING_KEYS.stripeSecretKey] || process.env.STRIPE_SECRET_KEY),
    plans: plansArr(db[SETTING_KEYS.plansList]),
    freeEnabled: db['plans.freeEnabled'] !== 'false',
    freeName: db['plans.freeName'] || 'Starter',
    freeDesc: db['plans.freeDesc'] || '',
  }
})

function plansArr(raw: string) {
  const fallback = [
    { key: 'pro', name: 'Pro', price: '$19.90', desc: '', priceId: '' },
    { key: 'enterprise', name: 'Enterprise', price: '$19.90', desc: '', priceId: '' },
  ]
  if (!raw) return fallback
  try {
    const p = JSON.parse(raw)
    if (Array.isArray(p) && p.length) return p
  } catch {}
  return fallback
}
