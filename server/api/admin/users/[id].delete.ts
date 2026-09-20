export default defineEventHandler(async (event) => {
  const admin = await getAuthUser(event)
  if (!admin || !admin.isAdmin) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  const userId = getRouterParam(event, 'id')
  if (userId === admin.id) {
    throw createError({ statusCode: 400, statusMessage: 'You cannot delete your own account' })
  }
  await prisma.user.delete({ where: { id: userId! } })
  return { ok: true }
})
