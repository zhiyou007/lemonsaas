# Lumen SaaS

> Nuxt 3 SaaS starter for going global. Stripe payments, Google OAuth, i18n, SEO, and a fully configurable admin panel — ship in one `docker compose up`.

> 基于 Nuxt 3 的出海 SaaS 模板：内置 Stripe 支付、Google 登录、中英文 i18n、SEO 全套、后台可视化配置，一条命令 Docker 启动。

---

[English](#english) · [中文](#中文)

---

## English

Lumen is a production-ready SaaS boilerplate designed for indie hackers and teams shipping to global markets. It bundles everything you need to launch — auth, billing, localization, SEO, and an admin dashboard — so you can focus on your product.

### Tech Stack

- **Framework**: Nuxt 3 (Vue 3, SSR, Nitro)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL 16 + Prisma ORM
- **Auth**: Cookie-based session + Google OAuth
- **Payments**: Stripe (Checkout, Customer Portal, webhooks)
- **i18n**: Built-in zh-CN / en, easily extensible
- **Deployment**: Docker + Docker Compose (one command)

### Features

- 🌍 **Internationalized UI** — Chinese & English out of the box, easy to add more languages
- 🔐 **Google Login** + email/password signup
- 💳 **Real Stripe billing** — sync prices from Stripe, enable/disable plans, highlight one "Most Popular"
- 🎛️ **Admin panel, fully DB-driven** — all secrets (OAuth, Stripe, GA, SEO) stored in DB, no `.env` edits needed
- 📊 **Dashboard** — real user / subscription stats, revenue chart, recent sales
- 📝 **Blog + Docs** — Markdown editor, SEO-friendly docs layout
- 🔍 **SEO complete** — robots.txt, sitemap.xml, canonical, hreflang, OG image, JSON-LD, GA4
- 📱 **Responsive** — mobile drawer sidebar, adaptive grids
- 🎨 **Clean UI** — Tailwind-based, dark mode ready

### Quick Start

```bash
# 1. Clone
git clone https://github.com/zhiyou007/lemonsaas.git
cd lemonsaas

# 2. Configure (optional for first run; all can be set in admin UI)
cp .env.example .env

# 3. Launch
docker compose up -d --build
```

Open http://localhost:3000 — the first registered user becomes admin.

### Default Admin

```
Email:    admin@example.com
Password: admin12345
```

### Project Structure

```
├── server/
│   ├── api/            # REST endpoints (auth, stripe, blog, stats, admin)
│   ├── utils/           # settings, prisma, auth helpers
│   └── middleware/
├── components/         # Vue components (dashboard, landing, ui)
├── pages/              # Nuxt pages (/, /dashboard, /docs, /blog...)
├── layouts/            # default, dashboard, docs
├── composables/        # useI18n, useUi, useAuth
├── i18n/locales/       # zh.ts, en.ts
├── prisma/schema.prisma
└── docker-compose.yml
```

### Configuration

All third-party credentials are configured in the admin panel at `/dashboard/settings` after login:

- **Google OAuth** — Client ID / Secret (with link to Google Cloud Console)
- **Stripe** — Secret key, publishable key, product ID (test mode ready)
- **Brand** — name, logo, description
- **SEO** — title, description, OG image, GA4 ID
- **Plans** — sync from Stripe, toggle free/paid plans, highlight one

---

## 中文

Lumen 是一个面向出海场景的生产级 SaaS 启动模板，集成了上线所需的全部基础设施——登录、支付、多语言、SEO、后台管理，让你专注于产品本身。

### 技术栈

- **框架**：Nuxt 3（Vue 3、SSR、Nitro）
- **样式**：Tailwind CSS
- **数据库**：PostgreSQL 16 + Prisma ORM
- **认证**：Cookie Session + Google OAuth
- **支付**：Stripe（Checkout、客户门户、Webhook）
- **多语言**：内置中/英，可轻松扩展
- **部署**：Docker + Docker Compose，一键启动

### 功能特性

- 🌍 **全系统 i18n** — 开箱即用中英文，新增语言只需加一个文件
- 🔐 **Google 登录** + 邮箱注册
- 💳 **真实 Stripe 支付** — 从 Stripe 同步价格，开关套餐，标记推荐套餐
- 🎛️ **后台可视化配置** — 所有密钥（OAuth、Stripe、GA、SEO）存数据库，无需改 `.env`
- 📊 **数据仪表盘** — 真实用户/订阅统计、收入图、最近销售
- 📝 **博客 + 文档** — Markdown 编辑器，SEO 友好的文档布局
- 🔍 **SEO 全套** — robots、sitemap、canonical、hreflang、OG 图、JSON-LD、GA4
- 📱 **响应式** — 移动端抽屉式侧边栏
- 🎨 **清爽 UI** — 基于 Tailwind，支持暗色模式

### 快速开始

```bash
# 1. 克隆
git clone https://github.com/zhiyou007/lemonsaas.git
cd lemonsaas

# 2. 配置（首次运行可选，所有配置都可在后台设置页完成）
cp .env.example .env

# 3. 启动
docker compose up -d --build
```

打开 http://localhost:3000，第一个注册的用户自动成为管理员。

### 默认管理员

```
邮箱：admin@example.com
密码：admin12345
```

### 目录结构

```
├── server/
│   ├── api/            # REST 接口（auth、stripe、blog、stats、admin）
│   ├── utils/           # 配置读取、prisma、鉴权工具
│   └── middleware/
├── components/         # Vue 组件（dashboard、落地页、UI）
├── pages/              # Nuxt 页面（/、/dashboard、/docs、/blog...）
├── layouts/            # default、dashboard、docs
├── composables/        # useI18n、useUi、useAuth
├── i18n/locales/       # zh.ts、en.ts
├── prisma/schema.prisma
└── docker-compose.yml
```

### 配置说明

所有第三方凭证都在后台 `/dashboard/settings` 页面配置：

- **Google OAuth** — Client ID / Secret（附申请入口链接）
- **Stripe** — Secret key、公钥、产品 ID（测试模式可用）
- **品牌** — 名称、Logo、简介
- **SEO** — title、description、OG 图、GA4 ID
- **套餐** — 从 Stripe 同步，开关免费/付费套餐，标记推荐项

---

## License

MIT
