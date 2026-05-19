# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案目標

以 TDD 方式練習前端開發，學習測試工具整合與 GitHub Actions CI/CD 流程。
**目前階段：前端（Nuxt 4）開發與測試，後端（Laravel）設定保留但暫未啟用。**

## 技術棧

| 層次 | 技術 |
|------|------|
| 前端框架 | Vue 3 + TypeScript + Nuxt 4.4.x |
| UI（規劃中）| Tailwind CSS + shadcn-vue + Radix Vue |
| 打包 | Vite 7.x（Nuxt 內建）|
| 容器 dev runtime | Node.js 22 + pnpm 11 |
| 容器 prod runtime | Bun（執行 Nuxt .output）|
| 套件管理 | pnpm 11（透過 corepack）|
| 狀態管理 | Pinia（`@pinia/nuxt`）|
| 單元/整合測試 | Vitest 3 + Vue Test Utils + @testing-library/vue + @nuxt/test-utils |
| E2E 測試 | Playwright |
| Lint/格式化 | ESLint（`@nuxt/eslint`）+ Prettier |
| 型別檢查 | vue-tsc（涵蓋 `.vue` 與 `.ts`）|
| pre-commit hook | Husky v9 + lint-staged |
| 後端（保留）| Laravel 11（PHP 8.3）|
| 資料庫（保留）| PostgreSQL 16 |
| 快取/Session（保留）| Redis 7 |
| 容器 | Podman 5.x + podman-compose |
| CI/CD | GitHub Actions |

## 容器架構

```
瀏覽器 → nginx（:80）→ nuxt（:3000）→ laravel（:8000）→ postgres（:5432）
                                  ↓
                               redis（快取/session）
```

- **nginx**：reverse proxy，所有流量進入點
- **nuxt**：SSR 前端 + BFF（`server/api/` 處理 BFF routes，內部呼叫 Laravel）
- **laravel**：核心 REST API，不對外暴露（僅透過 Nuxt BFF 存取）

## 開發指令

### 前提：建立 .env

```bash
cp .env.example .env
# 目前前端開發不需填入後端相關變數
```

### 前端容器操作（所有指令皆在容器內執行）

```bash
# 首次啟動（建置 image 並安裝依賴）
podman build -f docker/nuxt/Dockerfile --target development -t test-frontend-nuxt:dev frontend/

# 啟動 dev server（port 3000）
podman run --rm -it \
  -v ./frontend:/app \
  -v nuxt_modules:/app/node_modules \
  -p 3000:3000 \
  test-frontend-nuxt:dev

# 執行所有單元測試
podman run --rm \
  -v ./frontend:/app \
  -v nuxt_modules:/app/node_modules \
  test-frontend-nuxt:dev \
  sh -c "pnpm run test"

# 執行測試 watch 模式（TDD 開發時使用）
podman run --rm -it \
  -v ./frontend:/app \
  -v nuxt_modules:/app/node_modules \
  test-frontend-nuxt:dev \
  sh -c "pnpm run test:watch"

# 執行單一測試檔案
podman run --rm \
  -v ./frontend:/app \
  -v nuxt_modules:/app/node_modules \
  test-frontend-nuxt:dev \
  sh -c "pnpm run test tests/unit/pages/index.test.ts"

# Coverage（含 thresholds 驗證：lines/functions/statements 80%，branches 70%）
podman run --rm \
  -v ./frontend:/app \
  -v nuxt_modules:/app/node_modules \
  test-frontend-nuxt:dev \
  sh -c "pnpm run coverage"

# Type check（vue-tsc --noEmit，涵蓋 .vue 與 .ts）
podman run --rm \
  -v ./frontend:/app \
  -v nuxt_modules:/app/node_modules \
  test-frontend-nuxt:dev \
  sh -c "pnpm run typecheck"

# Lint
podman run --rm \
  -v ./frontend:/app \
  -v nuxt_modules:/app/node_modules \
  test-frontend-nuxt:dev \
  sh -c "pnpm run lint"

# E2E 測試（Playwright）
# 首次需先 build e2e image（Alpine base + 系統 Chromium，與 dev 共用 nuxt_modules volume）
podman build -f docker/nuxt/Dockerfile --target e2e -t test-frontend-e2e frontend/

# 執行 E2E 測試（webServer 自動啟動 dev server）
podman run --rm \
  -v ./frontend:/app \
  -v nuxt_modules:/app/node_modules \
  -e PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser \
  test-frontend-e2e
```

### pnpm 套件管理注意事項（pnpm 11）

pnpm 11 要求對含有 native build scripts 的套件明確核准，核准清單記錄在 `frontend/pnpm-workspace.yaml`。

```bash
# 新增套件（在容器內執行）
podman run --rm -it \
  -v ./frontend:/app \
  -v nuxt_modules:/app/node_modules \
  test-frontend-nuxt:dev \
  sh -c "pnpm add <package-name>"

# 若 pnpm install 出現 ERR_PNPM_IGNORED_BUILDS，執行以下兩步驟：
pnpm install || true
pnpm approve-builds --all
pnpm install
```

## 專案結構

```
├── .github/workflows/ci.yml   # CI：lint+typecheck / test+coverage 並行 → build → e2e
├── .husky/pre-commit           # git commit 前自動執行 lint-staged
├── docker/
│   ├── nginx/nginx.conf       # Reverse proxy 設定
│   ├── nuxt/Dockerfile        # development（Node 22）/ production（Bun）
│   └── laravel/Dockerfile     # Multi-stage（保留）
├── frontend/                  # Nuxt 4 應用
│   ├── app/                   # srcDir：pages、components、composables、stores
│   ├── server/api/            # BFF routes（Nitro server）
│   ├── tests/
│   │   ├── unit/              # Vitest 單元測試（對應 app/ 結構）
│   │   └── e2e/               # Playwright E2E 測試
│   ├── vitest.config.ts       # 使用 @nuxt/test-utils nuxt environment，設有 coverage thresholds
│   ├── playwright.config.ts
│   ├── eslint.config.mjs      # 繼承 @nuxt/eslint，覆寫 vue/html-self-closing（允許 <input />）
│   ├── .prettierrc            # Prettier 設定（singleQuote、printWidth 120 等）
│   ├── nuxt.config.ts
│   ├── pnpm-workspace.yaml    # pnpm 11 allowBuilds 核准清單（需 commit）
│   └── package.json
├── backend/                   # Laravel 應用（保留，未初始化）
├── compose.yaml               # 完整 5 服務 podman-compose
└── .env.example               # 環境變數範本
```

## TDD 工作流程

Red → Green → Refactor 循環：

1. **Red**：先寫會失敗的測試，定義期望行為
2. **Green**：寫最小程式碼讓測試通過
3. **Refactor**：在測試保護下重構

測試分層：
- **Vitest + @nuxt/test-utils**：元件、composable、BFF route handler 的單元/整合測試
  - 使用 `mountSuspended()` 掛載含非同步操作的元件
  - `~` alias 指向 `app/`（srcDir），import 路徑用 `~/pages/xxx.vue`
- **Playwright**：完整使用者流程的 E2E 測試
  - E2E 容器使用 Alpine base + 系統 Chromium（`apk add chromium`），與 dev 容器共用 `nuxt_modules` named volume，避免 musl/glibc native binding 衝突
  - `playwright.config.ts` 的 `webServer` 讓 Playwright 自動管理 dev server 生命週期
  - E2E 測試的 `beforeEach` 需等待 `#__nuxt.__vue_app__` 確認 Vue hydration 完成，否則 `v-model` 事件監聽器未掛載，`fill()` 後的值不會進入 Vue 響應式狀態

## CI/CD 流程

`.github/workflows/ci.yml` 在每次 push/PR 執行：

```
lint（ESLint + Type check）↘
                            → build（Nuxt）→ e2e（Playwright）
test（Vitest + coverage）   ↗
```

- **lint job**：ESLint → vue-tsc 型別檢查，兩者皆通過才算成功
- **test job**：`pnpm run coverage`，coverage 低於 thresholds 直接失敗
- lint 與 test 並行執行，build 需兩者通過後才執行
- E2E 失敗時自動上傳 Playwright report artifact
- `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true`：強制 GitHub Actions 內建套件使用 Node 24 runtime，避免 Node 20 deprecation 警告

## 注意事項

- **pnpm-workspace.yaml** 記錄 native 套件的 build 核准清單，**必須 commit 到 git**，CI 才能正常安裝。
- **`~` alias**：在 Nuxt 4 指向 `srcDir`（`app/`），測試中 import 元件用 `~/pages/xxx.vue` 而非 `~/app/pages/xxx.vue`。
- **Bun 作為 production runtime**：Nuxt 建置輸出（`.output/server/index.mjs`）由 `bun run` 執行；開發與 CI 階段使用 Node.js 22 確保 pnpm 相容性。
- **Laravel 生產注意**：目前使用 `php artisan serve`，適合學習用途。正式部署應改用 php-fpm + nginx 或 Laravel Octane。
- **BFF routes**：放在 `frontend/server/api/`，內部透過 `LARAVEL_API_URL`（`http://laravel:8000`）呼叫 Laravel，不對瀏覽器直接暴露。
- **vue-tsc**：`vue-tsc --noEmit` 是 `tsc` 的封裝，同時涵蓋 `.vue` SFC 與 `.ts` 的完整型別推斷。ESLint 的 TS 支援是語法層級，vue-tsc 才能抓到跨檔型別錯誤（例如 prop 型別不符、composable 回傳型別錯誤）。
- **Husky pre-commit**：`.husky/pre-commit` 執行 `cd frontend && pnpm lint-staged`，只對本次 staged 的 `.vue/.ts/.js` 跑 ESLint --fix + Prettier --write，`.json/.md/.yaml` 只跑 Prettier。`prepare` 加 `|| true` 確保 CI 與容器環境不會因找不到 husky 而失敗。
- **Coverage thresholds**：`vitest.config.ts` 設定 lines/functions/statements 80%，branches 70%。CI 跑 `pnpm run coverage`，低於門檻直接失敗。
