export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const id = getRouterParam(event, 'id')
  await prisma.project.deleteMany({ where: { id: id!, ownerId: user.id } })
  return { ok: true }
})
