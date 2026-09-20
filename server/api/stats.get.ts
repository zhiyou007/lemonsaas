export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const totalUsers = await prisma.user.count()
  const paidUsers = await prisma.user.count({ where: { subscription: { plan: { not: 'free' } } } })
  const recentPaid = await prisma.user.findMany({
    where: { subscription: { plan: { not: 'free' } } },
    take: 5, orderBy: { createdAt: 'desc' }, include: { subscription: true }
  })

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const revenue = months.map(m => ({ month: m, value: 0 }))

  return {
    stats: {
      totalRevenue: paidUsers,
      totalRevenueDelta: 0,
      subscriptions: paidUsers,
      subscriptionsDelta: 0,
      sales: totalUsers,
      salesDelta: 0,
      activeNow: 1,
      activeNowDelta: 0
    },
    revenue,
    recentSales: recentPaid.map(u => ({
      name: u.name,
      email: u.email,
      amount: 1990
    }))
  }
})
