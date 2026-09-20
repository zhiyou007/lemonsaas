import { SETTING_KEYS, getSetting } from '~/server/utils/settings'

function displayPrice(amount: string, type: string) {
  const a = String(amount || '').trim()
  if (type === 'free' || a === '0' || a === '') return '$0'
  if (type === 'yearly') return `$${a}/yr`
  if (type === 'lifetime') return `$${a} one-time`
  return `$${a}/mo`
}

const FREE_PLAN = { key: 'starter', name: 'Starter', price: '$0', priceType: 'free', desc: 'For side projects — start for free.', priceId: '' }

export default defineEventHandler(async () => {
  let plans: any[] = []
  const freeEnabled = (await getSetting('plans.freeEnabled', 'true')) !== 'false'
  if (freeEnabled) {
    plans.push({
      key: 'starter',
      name: await getSetting('plans.freeName', 'Starter'),
      price: '$0',
      priceType: 'free',
      desc: await getSetting('plans.freeDesc', 'For side projects — start for free.'),
      priceId: '',
    })
  }
  const raw = await getSetting(SETTING_KEYS.plansList, '')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) {
        const paid = parsed
          .filter((p: any) => p.enabled !== false)
          .map((p: any) => ({ ...p, price: displayPrice(p.amount || p.price, p.priceType || 'monthly'), highlighted: !!p.highlighted }))
        plans = [...plans, ...paid]
      }
    } catch {}
  }
  return { plans }
})
