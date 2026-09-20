export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const body = await readBody(event)
  const name = String(body?.name || '').trim()
  if (!name) throw createError({ statusCode: 400, statusMessage: 'Name is required' })
  const project = await prisma.project.create({
    data: {
      name,
      description: String(body?.description || '').trim(),
      ownerId: user.id
    }
  })
  return { project }
})
