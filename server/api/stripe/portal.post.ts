export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (!user.stripeCustomerId) {
    throw createError({ statusCode: 400, statusMessage: 'No billing account yet. Start a subscription first.' })
  }

  const stripe = await getStripe()
  const origin = getHeader(event, 'origin') || 'http://localhost:3000'
  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${origin}/dashboard/billing`
  })

  return { url: portal.url }
})
