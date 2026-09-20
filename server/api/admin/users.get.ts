import { SETTING_KEYS, getSetting } from '~/server/utils/settings'

async function requireAdmin(event: any) {
  const user = await getAuthUser(event)
  if (!user || !user.isAdmin) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  return user
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { subscription: true }
  })
  // Build priceId -> plan name map from settings
  const raw = await getSetting(SETTING_KEYS.plansList, '')
  const planMap: Record<string, string> = {}
  try {
    const parsed = JSON.parse(raw || '[]')
    parsed.forEach((p: any) => { if (p.priceId) planMap[p.priceId] = p.name; if (p.key) planMap[p.key] = p.name })
  } catch {}
  const freeName = await getSetting('plans.freeName', 'Starter')

  return {
    users: users.map((u) => {
      const plan = u.subscription?.plan || 'free'
      const planName = plan === 'free' ? freeName : (planMap[plan] || plan)
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        isAdmin: u.isAdmin,
        plan,
        planName,
        createdAt: u.createdAt
      }
    }),
    total: users.length,
    pro: users.filter((u) => (u.subscription?.plan || 'free') !== 'free').length
  }
})
