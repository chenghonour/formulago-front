# Formulago Front

Enterprise admin frontend for [Formulago](https://github.com/chenghonour/formulago) Go backend.

## Tech Stack

- **Framework**: Vue 3 + Vite + TypeScript
- **UI**: Ant Design Vue + Tailwind CSS (shadcn-vue style components)
- **Monorepo**: pnpm workspace + Turborepo
- **State**: Pinia
- **Router**: Vue Router
- **HTTP**: axios
- **i18n**: vue-i18n
- **Lint**: ESLint + Oxlint + Stylelint + Commitlint (lefthook)
- **Test**: Vitest + Playwright
- **Build**: tsdown (library packages)

## Project Structure

```
formulago-front/
├── apps/
│   └── web-antd/          # Main application (Ant Design Vue)
├── packages/
│   ├── @core/             # Core framework packages (base, UI kit, composables)
│   │   ├── base/          # shared, design, icons, typings
│   │   ├── ui-kit/        # form-ui, layout-ui, shadcn-ui, tabs-ui, menu-ui, popup-ui
│   │   ├── composables/   # Shared composables
│   │   └── preferences/   # App preferences system
│   ├── effects/           # Business feature packages
│   │   ├── access/        # RBAC permission control
│   │   ├── common-ui/     # Shared business components
│   │   ├── hooks/         # Business hooks
│   │   ├── layouts/       # Layout components
│   │   ├── plugins/       # Plugin integrations (echarts, tiptap, vxe-table)
│   │   └── request/       # HTTP request layer
│   ├── constants/         # Shared constants
│   ├── icons/             # Icon system
│   ├── locales/           # i18n translations
│   ├── preferences/       # Preferences logic
│   ├── stores/            # Global stores (auth, tabbar, etc.)
│   ├── styles/            # Global styles
│   ├── types/             # Shared TypeScript types
│   └── utils/             # Shared utilities
├── internal/              # Build tooling & configs
│   ├── lint-configs/      # ESLint, commitlint, oxlint, stylelint configs
│   ├── node-utils/        # Node.js utility scripts
│   ├── tailwind-config/   # Tailwind CSS theme
│   ├── tsconfig/          # TypeScript configs
│   └── vite-config/       # Vite plugins & shared config
└── scripts/               # Workspace scripts & tools
```

## Scripts

```bash
pnpm dev            # Start dev server
pnpm build          # Build for production
pnpm build:antd     # Build only web-antd app
pnpm lint           # Run all linters
pnpm check:type     # TypeScript type check
pnpm test:unit      # Unit tests
pnpm clean          # Clean build artifacts
pnpm commit         # Interactive commit (czg)
```

## Package Scope

- `@formulago/*` — Internal workspace packages (apps, effects, utils, etc.)
- `@vben-core/*` — Core framework packages (base shared, UI kit, composables)
- `@formulago/web-antd` — Main application

## Key Conventions

- Package scope `@formulago/` for all workspace packages
- Core framework packages use `@vben-core/` scope (legacy, keep unchanged)
- Component exports use `Vben` prefix (e.g., `VbenAdminLayout`, `setupVbenForm`)
- i18n: vue-i18n with namespaced JSON files under `packages/locales/src/langs/`
- API requests use axios with interceptors in `packages/effects/request/`
- Route modules auto-loaded from `apps/web-antd/src/router/routes/modules/`

## i18n (Internationalization) Conventions

### Supported languages
- `zh-CN` (default) and `en-US`

### Translation files
- **Shared translations**: `packages/locales/src/langs/{locale}/` — `common.json`, `ui.json`, `authentication.json`, `preferences.json`, `profile.json`
- **App-specific translations**: `apps/web-antd/src/locales/langs/{locale}/` — `page.json`, `demos.json`, `system.json`
- New JSON files in these directories are auto-discovered by Vite's `import.meta.glob`, no registration needed.

### Page content i18n
- All user-visible text in views (column titles, form labels, buttons, messages, placeholders) must use `$t('namespace.key')` from `#/locales`.
- Translation keys are organized by namespace (e.g., `system.role.title`, `system.column.name`).
- Do NOT use `$t()` on hardcoded Chinese strings — always use proper translation keys.

### Sidebar menu, breadcrumb, tab title, browser title i18n
These come from route `meta` fields — **not** from `$t()` translation keys. The data flows from the backend API:
1. Backend `/admin/menu/role` returns menu items with `name` (English) and `meta.title` (Chinese)
2. `apps/web-antd/src/api/core/menu.ts` → `transformMenu()` sets:
   - `meta.title` = `backendMenu.meta?.title || backendMenu.name` (Chinese)
   - `meta.titleEn` = `backendMenu.name` (English)
3. Route `meta` must have BOTH `title` (Chinese) and `titleEn` (English) for locale switching to work
4. The menu rendering (`use-mixed-menu.ts` / `use-extra-menu.ts`) uses `localizeMenus()` which checks `preferences.app.locale` and swaps `name` / `nameEn`
5. Breadcrumb (`breadcrumb.vue`) and tabbar (`use-tabbar.ts`) check `preferences.app.locale` and use `meta.titleEn` for English mode

### Adding new pages
- Add translation keys to both `zh-CN` and `en-US` locale files
- If the page appears in the sidebar: ensure the backend returns proper `name` (English) and `meta.title` (Chinese)
- For static routes (rare), explicitly set both `meta.title` and `meta.titleEn` in the route definition

## Related

- Backend: https://github.com/chenghonour/formulago (Go, Hertz + Ent + Casbin + JWT)
