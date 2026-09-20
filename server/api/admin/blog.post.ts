export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user || !user.isAdmin) throw createError({ statusCode: 403 })
  const b = await readBody(event)
  if (b.id) {
    await prisma.blogPost.update({ where: { id: b.id }, data: b })
  } else {
    await prisma.blogPost.create({ data: b })
  }
  return { ok: true }
})
