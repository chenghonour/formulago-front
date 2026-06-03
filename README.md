<div align="center">
  <h1>Formulago Front</h1>
  <p>Enterprise admin frontend based on Vue Vben Admin, adapted for <a href="https://github.com/chenghonour/formulago">Formulago</a>.</p>

[![license](https://img.shields.io/github/license/chenghonour/formulago-front.svg)](LICENSE)
</div>

**English** | [中文](./README.zh-CN.md)

## Overview

Formulago Front is the administration UI for the [Formulago](https://github.com/chenghonour/formulago) Go backend. Built on [Vue Vben Admin](https://github.com/vbenjs/vue-vben-admin) v5 and customized to work with Formulago's RBAC permission system.

### Tech Stack

- **Framework**: Vue 3 + Vite + TypeScript
- **UI**: Tailwind CSS
- **State**: Pinia
- **Router**: Vue Router
- **API**: axios
- **i18n**: vue-i18n

## Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

## Related Projects

- [Formulago](https://github.com/chenghonour/formulago) — Go backend (Hertz + Ent + Casbin + JWT)

## Browser Support

Supports modern browsers (Safari 16.4+, Chrome 111+, Firefox 128+). Not compatible with IE.

## License

[MIT](./LICENSE)
