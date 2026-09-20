export default defineEventHandler(async () => {
  return { posts: await prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } }) }
})
