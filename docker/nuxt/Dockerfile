# Development + Build：Node.js 22 + pnpm（套件管理最穩定組合）
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Development：掛載 host 原始碼，啟動 Nuxt dev server
FROM base AS development
EXPOSE 3000
CMD ["sh", "-c", "pnpm install && pnpm run dev"]

# Builder：安裝依賴並建置 Nuxt .output
FROM base AS builder
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Production：僅複製 .output，以 Bun runtime 執行
FROM oven/bun:1-alpine AS production
WORKDIR /app
COPY --from=builder /app/.output ./.output
ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "run", ".output/server/index.mjs"]
