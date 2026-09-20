export default defineEventHandler(async (event) => {
  const admin = await getAuthUser(event)
  if (!admin || !admin.isAdmin) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  const userId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const plan = String(body?.plan || 'free')
  await prisma.subscription.upsert({
    where: { userId: userId! },
    create: { userId: userId!, plan, status: 'active' },
    update: { plan }
  })
  return { ok: true }
})
