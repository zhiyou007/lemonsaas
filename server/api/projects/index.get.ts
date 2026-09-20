export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const projects = await prisma.project.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: 'desc' }
  })
  return { projects }
})
