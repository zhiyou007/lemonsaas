export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const stripe = await getStripe()
  const body = await readBody(event)
  const plan = String(body?.plan || 'pro')
  // Resolve the priceId from the configured plans list by plan key.
  const raw = await getSetting(SETTING_KEYS.plansList, '')
  let priceId = ''
  if (raw) {
    try {
      const list = JSON.parse(raw)
      const found = list.find((p: any) => p.key === plan)
      priceId = found?.priceId || ''
    } catch {}
  }
  if (!priceId) {
    // Fallback to the legacy pro/ent settings.
    priceId = plan === 'enterprise'
      ? await getSetting(SETTING_KEYS.stripePriceEnt, process.env.STRIPE_PRICE_ENT_ID || '')
      : await getSetting(SETTING_KEYS.stripePricePro, process.env.STRIPE_PRICE_PRO_ID || '')
  }
  if (!priceId) {
    throw createError({ statusCode: 500, statusMessage: `Stripe price for "${plan}" is not configured` })
  }

  // Ensure a Stripe customer exists for this user
  let customerId = user.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id }
    })
    customerId = customer.id
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } })
  }

  const origin = getHeader(event, 'origin') || 'http://localhost:3000'
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: process.env.STRIPE_SUCCESS_URL || `${origin}/dashboard/billing?success=true`,
    cancel_url: process.env.STRIPE_CANCEL_URL || `${origin}/dashboard/billing?canceled=true`,
    metadata: { userId: user.id, plan }
  })

  return { url: session.url }
})
