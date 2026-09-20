export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user || !user.isAdmin) throw createError({ statusCode: 403 })
  const id = getRouterParam(event, 'id')
  await prisma.blogPost.delete({ where: { id } })
  return { ok: true }
})
