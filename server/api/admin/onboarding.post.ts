export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user || !user.isAdmin) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  const body = await readBody(event)
  const ops: { key: string; value: string }[] = []
  if (typeof body?.siteName === 'string' && body.siteName.trim()) {
    ops.push({ key: 'site.name', value: body.siteName.trim() })
  }
  if (typeof body?.logo === 'string' && body.logo.startsWith('data:image/')) {
    if (body.logo.length > 300 * 1024 * 1.34) {
      throw createError({ statusCode: 400, statusMessage: 'Logo must be under 300 KB' })
    }
    ops.push({ key: 'site.logo', value: body.logo })
  }
  if (typeof body?.completed === 'boolean') {
    ops.push({ key: 'onboarding.completed', value: String(body.completed) })
  }
  if (typeof body?.seoTitle === 'string') ops.push({ key: 'seo.title', value: body.seoTitle.trim() })
  if (typeof body?.seoDescription === 'string') ops.push({ key: 'seo.description', value: body.seoDescription.trim() })
  if (typeof body?.analyticsId === 'string') ops.push({ key: 'analytics.gaId', value: body.analyticsId.trim() })
  if (typeof body?.siteUrl === 'string') ops.push({ key: 'site.url', value: body.siteUrl.trim().replace(/\/$/, '') })
  if (typeof body?.ogImage === 'string' && body.ogImage.startsWith('data:image/')) ops.push({ key: 'site.ogImage', value: body.ogImage })
  for (const op of ops) {
    await prisma.setting.upsert({
      where: { key: op.key },
      create: { key: op.key, value: op.value },
      update: { value: op.value }
    })
  }
  return { ok: true }
})
