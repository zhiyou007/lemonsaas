export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user || !user.isAdmin) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const stripe = await getStripe()
  const prices = await stripe.prices.list({ active: true, limit: 100, expand: ['data.product'] })

  return {
    prices: prices.data.map((p: any) => ({
      priceId: p.id,
      productName: typeof p.product === 'object' && p.product?.name ? p.product.name : '',
      amount: p.unit_amount ? (p.unit_amount / 100).toFixed(2) : '',
      currency: (p.currency || 'usd').toUpperCase(),
      interval: p.recurring?.interval || '',
    }))
  }
})
