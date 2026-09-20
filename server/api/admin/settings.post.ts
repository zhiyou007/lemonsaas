import { SETTING_KEYS, setSetting } from '~/server/utils/settings'

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user || !user.isAdmin) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const body = await readBody(event)
  const map: Record<string, string> = {
    googleClientId: SETTING_KEYS.googleClientId,
    googleClientSecret: SETTING_KEYS.googleClientSecret,
    stripeSecretKey: SETTING_KEYS.stripeSecretKey,
    stripePublishableKey: SETTING_KEYS.stripePublishableKey,
    stripePricePro: SETTING_KEYS.stripePricePro,
    stripePriceEnt: SETTING_KEYS.stripePriceEnt,
    stripeWebhookSecret: SETTING_KEYS.stripeWebhookSecret,
  }

  for (const [field, key] of Object.entries(map)) {
    const v = body?.[field]
    if (typeof v === 'string' && v.trim() && v !== '***') {
      await setSetting(key, v.trim())
    }
  }

  if (typeof body?.freeEnabled === 'boolean') {
    await setSetting('plans.freeEnabled', body.freeEnabled ? 'true' : 'false')
  }
  if (typeof body?.freeName === 'string') await setSetting('plans.freeName', body.freeName)
  if (typeof body?.freeDesc === 'string') await setSetting('plans.freeDesc', body.freeDesc)

  // Plans list: body.plans is an array of {key,name,amount,priceType,desc,priceId,enabled,highlighted}
  if (Array.isArray(body?.plans)) {
    const clean = body.plans
      .filter((p: any) => p && p.name)
      .map((p: any) => ({
        key: String(p.key || p.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: String(p.name),
        amount: String(p.amount || ''),
        priceType: String(p.priceType || 'monthly'),
        desc: String(p.desc || ''),
        priceId: String(p.priceId || ''),
        enabled: p.enabled !== false,
        highlighted: !!p.highlighted,
      }))
    await setSetting(SETTING_KEYS.plansList, JSON.stringify(clean))
  }

  return { ok: true }
})
