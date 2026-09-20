export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user || !user.isAdmin) throw createError({ statusCode: 403 })
  return { posts: await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } }) }
})
