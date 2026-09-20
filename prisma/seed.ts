import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const userCount = await prisma.user.count()
  if (userCount === 0) {
    const hash = await bcrypt.hash('admin12345', 10)
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin',
        password: hash,
        isAdmin: true,
      },
    })
    console.log('Seeded admin@example.com / admin12345')
  }

  const postCount = await prisma.blogPost.count()
  if (postCount === 0) {
    await prisma.blogPost.create({
      data: {
        id: 'post-intro-1',
        slug: 'introducing-lumen',
        title: 'Introducing Lumen — Nuxt 3 SaaS Starter',
        excerpt: 'Lumen is a production-ready Nuxt 3 SaaS starter with Stripe, Google OAuth, i18n, SEO and Docker.',
        content: '# Introducing Lumen\n\nLumen is a production-ready SaaS boilerplate built on **Nuxt 3**.\n\n**GitHub**: https://github.com/zhiyou007/lemonsaas\n\n## What is included\n\n- Auth: Email + Google OAuth\n- Payments: Stripe Checkout\n- i18n: English & Chinese\n- SEO: robots, sitemap, OG, GA4\n\nMIT licensed.',
        published: true,
      },
    })
    console.log('Seeded sample blog post')
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
