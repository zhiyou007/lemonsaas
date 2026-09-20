export default defineEventHandler(async (event) => {
  const stripe = await getStripe()
  const secret = await getSetting(SETTING_KEYS.stripeWebhookSecret, process.env.STRIPE_WEBHOOK_SECRET || '')
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: 'Stripe webhook secret is not configured' })
  }

  const rawBody = await readRawBody(event, 'utf8')
  const signature = getHeader(event, 'stripe-signature')
  if (!rawBody || !signature) {
    throw createError({ statusCode: 400, statusMessage: 'Missing request body or signature' })
  }

  let stripeEvent
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, secret)
  } catch (err: any) {
    throw createError({ statusCode: 400, statusMessage: `Webhook signature verification failed: ${err.message}` })
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object
    const userId = session.metadata?.userId
    const plan = session.metadata?.plan
    if (userId && plan) {
      await prisma.subscription.upsert({
        where: { userId },
        create: { userId, plan, status: 'active', renewsAt: new Date(Date.now() + 30 * 86400_000) },
        update: { plan, status: 'active' }
      })
    }
  }

  if (stripeEvent.type === 'customer.subscription.deleted') {
    const sub = stripeEvent.data.object
    const user = await prisma.user.findFirst({ where: { stripeCustomerId: String(sub.customer) } })
    if (user) {
      await prisma.subscription.update({
        where: { userId: user.id },
        data: { plan: 'free', status: 'canceled' }
      })
    }
  }

  return { received: true }
})
