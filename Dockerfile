FROM node:20-alpine

WORKDIR /app

# Prisma needs openssl at runtime
RUN apk add --no-cache openssl

COPY package.json ./
RUN npm install

COPY . .

RUN npx prisma generate && npm run build

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
EXPOSE 3000

# Push schema to DB on start (starter-grade), then boot the built server
CMD ["sh", "-c", "npx prisma db push --skip-generate && npx tsx prisma/seed.ts && node .output/server/index.mjs"]
