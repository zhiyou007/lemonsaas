// Settings stored in DB (Setting table) take priority; env vars are the fallback.
// This lets the admin edit keys from the UI without redeploying.

export const SETTING_KEYS = {
  googleClientId: 'auth.google.clientId',
  googleClientSecret: 'auth.google.clientSecret',
  stripeSecretKey: 'pay.stripe.secretKey',
  stripePublishableKey: 'pay.stripe.publishableKey',
  stripePricePro: 'pay.stripe.pricePro',
  stripePriceEnt: 'pay.stripe.priceEnt',
  stripeWebhookSecret: 'pay.stripe.webhookSecret',
  planProName: 'plan.pro.name',
  planProPrice: 'plan.pro.price',
  planProDesc: 'plan.pro.desc',
  planEntName: 'plan.ent.name',
  planEntPrice: 'plan.ent.price',
  planEntDesc: 'plan.ent.desc',
  plansList: 'plans.list',
} as const

const cache = new Map<string, string>()
let cacheLoaded = false

async function load() {
  if (cacheLoaded) return
  const rows = await prisma.setting.findMany({
    where: { key: { in: Object.values(SETTING_KEYS) } }
  })
  cache.clear()
  for (const r of rows) cache.set(r.key, r.value)
  cacheLoaded = true
}

export async function getSetting(key: string, fallback = ''): Promise<string> {
  await load()
  return cache.get(key) || fallback
}

export async function setSetting(key: string, value: string) {
  await prisma.setting.upsert({
    where: { key },
    create: { key, value },
    update: { value }
  })
  cache.set(key, value)
}

export function invalidateSettings() { cacheLoaded = false }
