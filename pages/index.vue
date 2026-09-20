<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
const { t } = useI18n()
const { data: site } = await useFetch('/api/site', { key: 'site' })
useHead(() => ({
  bodyAttrs: { class: 'bg-background' },
  title: site.value?.seoTitle || (site.value?.siteName || 'Lumen') + ' — Modern SaaS Platform',
  meta: [
    { name: 'description', content: site.value?.seoDescription || 'The modern analytics, billing and revenue platform for fast-growing teams.' },
    { property: 'og:title', content: site.value?.seoTitle || site.value?.siteName || 'Lumen' },
    { property: 'og:description', content: site.value?.seoDescription || '' },
    { property: 'og:type', content: 'website' },
    ...(site.value?.ogImage ? [{ property: 'og:image', content: site.value.ogImage }] : []),
  ],
  link: site.value?.siteUrl ? [
    { rel: 'canonical', href: site.value.siteUrl + '/' },
    { rel: 'alternate', hreflang: 'en', href: site.value.siteUrl + '/' },
    { rel: 'alternate', hreflang: 'zh', href: site.value.siteUrl + '/?lang=zh' },
    { rel: 'alternate', hreflang: 'x-default', href: site.value.siteUrl + '/' },
  ] : [],
  script: [
    { innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: site.value?.siteName || 'Lumen', applicationCategory: 'BusinessApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }) },
    ...(site.value?.analyticsId ? [
      { src: 'https://www.googletagmanager.com/gtag/js?id=' + site.value.analyticsId, defer: true },
      { innerHTML: 'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","'+site.value.analyticsId+'");' },
    ] : []),
  ],
}))


const features = [
  { icon: 'M3 3v18h18M7 14l4-4 3 3 5-6', t: ['l.f1t','l.f1d'] },
  { icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', t: ['l.f2t','l.f2d'] },
  { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', t: ['l.f3t','l.f3d'] },
  { icon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z', t: ['l.f4t','l.f4d'] },
  { icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', t: ['l.f5t','l.f5d'] },
  { icon: 'M4 4h16v16H4zM4 10h16M10 4v16', t: ['l.f6t','l.f6d'] }
]


const { data: plansData } = await useFetch('/api/plans', { key: 'plans' })
const plans = computed(() => {
  const list = plansData.value?.plans
  if (!Array.isArray(list) || !list.length) return []
  return list.map((p: any, i: number) => ({
    name: p.name, price: p.price, desc: p.desc,
    features: [],
    cta: t('l.ctaStart'),
    highlighted: !!p.highlighted,
  }))
})

const testimonials = [
  { t: ['l.t1','l.n1','l.r1'] },
  { t: ['l.t2','l.n2','l.r2'] },
  { t: ['l.t3','l.n3','l.r3'] }
]

const faqs = [
  { t: ['l.q1','l.a1'] },
  { t: ['l.q2','l.a2'] },
  { t: ['l.q3','l.a3'] },
  { t: ['l.q4','l.a4'] }
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(79,70,229,0.12),transparent)]"></div>
      <div class="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 sm:py-32">
        <span class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> {{ t('landing.badge') }}
        </span>
        <h1 class="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          {{ t('landing.heroTitle1') }} <span class="bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">{{ t('landing.heroTitle2') }}</span> {{ t('landing.heroTitle3') }}
        </h1>
        <p class="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          {{ t('landing.heroSub') }}
        </p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <NuxtLink to="/signup" class="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90">{{ t('landing.ctaPrimary') }}</NuxtLink>
          <NuxtLink to="/login" class="rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-muted">{{ t('landing.ctaDemo') }}</NuxtLink>
        </div>

        <!-- Dashboard mockup -->
        <div class="mx-auto mt-16 max-w-4xl rounded-xl border border-border bg-card p-2 shadow-2xl">
          <div class="rounded-lg border border-border bg-background p-6 text-left">
            <div class="flex items-center justify-between">
              <p class="text-sm text-muted-foreground">{{ t("d.docs_dash") }}</p>
              <span class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{{ t("d.docs_live") }}</span>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div v-for="c in [['US$45,231', '+20.1%'], ['2,350', '+180.5%'], ['12,234', '+45%'], ['573', '+201']]" :key="c[0]" class="rounded-lg border border-border p-3">
                <p class="text-lg font-bold">{{ c[0] }}</p>
                <p class="text-xs text-emerald-600">{{ c[1] }}</p>
              </div>
            </div>
            <div class="mt-4 flex h-32 items-end gap-2">
              <div v-for="(h, i) in [40, 65, 50, 80, 55, 90, 70, 95, 60, 75, 88, 100]" :key="i" class="flex-1 rounded-t bg-primary/70" :style="{ height: h + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Logos -->
    <section class="border-y border-border/60 bg-card/50 py-10">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <p class="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">{{ t('landing.trusted') }}</p>
        <div class="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-bold text-muted-foreground/70">
          <span>Northwind</span><span>Loop</span><span>Framewell</span><span>Hexa</span><span>Ondine</span>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ t('landing.featuresTitle') }}</h2>
        <p class="mt-4 text-muted-foreground">{{ t('landing.featuresSub') }}</p>
      </div>
      <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="f in features" :key="f.icon" class="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
          <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="f.icon" /></svg>
          </span>
          <h3 class="mt-4 font-semibold">{{ t(f.t[0]) }}</h3>
          <p class="mt-2 text-sm text-muted-foreground">{{ t(f.t[1]) }}</p>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="border-t border-border/60 bg-card/30 py-24">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ t('landing.pricingTitle') }}</h2>
          <p class="mt-4 text-muted-foreground">{{ t('landing.pricingSub') }}</p>
        </div>
        <div class="mt-14 grid gap-6 md:grid-cols-3">
          <div
            v-for="p in plans"
            :key="p.name"
            class="relative rounded-2xl border p-6"
            :class="p.highlighted ? 'border-primary bg-card shadow-lg ring-1 ring-primary' : 'border-border bg-card'"
          >
            <span v-if="p.highlighted" class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">{{ t('landing.popular') }}</span>
            <h3 class="font-semibold">{{ p.name }}</h3>
            <p class="mt-1 text-sm text-muted-foreground">{{ p.desc }}</p>
            <p class="mt-4 text-4xl font-extrabold tracking-tight">{{ p.price }}</p>
            <ul v-if="p.features.length" class="mt-6 space-y-3">
              <li v-for="f in p.features" :key="f" class="flex items-start gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                {{ f }}
              </li>
            </ul>
            <NuxtLink to="/signup" class="mt-8 block rounded-md px-4 py-2.5 text-center text-sm font-semibold" :class="p.highlighted ? 'bg-primary text-primary-foreground hover:opacity-90' : 'border border-border hover:bg-muted'">{{ p.cta }}</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div class="grid gap-6 md:grid-cols-3">
        <figure v-for="tm in testimonials" :key="tm.t[1]" class="rounded-xl border border-border bg-card p-6">
          <blockquote class="text-sm leading-relaxed">"{{ t(tm.t[0]) }}"</blockquote>
          <figcaption class="mt-4 flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{{ t(tm.t[1]).split(' ').map(w=>w[0]).join('') }}</div>
            <div>
              <p class="text-sm font-medium">{{ t(tm.t[1]) }}</p>
              <p class="text-xs text-muted-foreground">{{ t(tm.t[2]) }}</p>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="border-t border-border/60 bg-card/30 py-24">
      <div class="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 class="text-center text-3xl font-bold tracking-tight">{{ t('landing.faqTitle') }}</h2>
        <div class="mt-10 space-y-4">
          <details v-for="f in faqs" :key="f.t[0]" class="group rounded-xl border border-border bg-card p-5">
            <summary class="flex cursor-pointer items-center justify-between font-medium">
              {{ t(f.t[0]) }}
              <span class="text-muted-foreground transition-transform group-open:rotate-45">+</span>
            </summary>
            <p class="mt-3 text-sm text-muted-foreground">{{ t(f.t[1]) }}</p>
          </details>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ t('landing.ctaTitle') }}</h2>
      <p class="mx-auto mt-4 max-w-md text-muted-foreground">{{ t('landing.ctaSub') }}</p>
      <NuxtLink to="/signup" class="mt-8 inline-block rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">{{ t('landing.ctaBtn') }}</NuxtLink>
    </section>
  </div>
</template>
