export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const post = await prisma.blogPost.findFirst({ where: { slug, published: true } })
  if (!post) throw createError({ statusCode: 404 })
  return post
})
