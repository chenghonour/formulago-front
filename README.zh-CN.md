<div align="center">
  <h1>Formulago Front</h1>
  <p>基于 Vue Vben Admin 的企业级管理后台前端，适配 <a href="https://github.com/chenghonour/formulago">Formulago</a> 后端。</p>

[![license](https://img.shields.io/github/license/chenghonour/formulago-front.svg)](LICENSE)
</div>

**中文** | [English](./README.md)

## 简介

Formulago Front 是 [Formulago](https://github.com/chenghonour/formulago) Go 后端的配套管理界面。基于 [Vue Vben Admin](https://github.com/vbenjs/vue-vben-admin) v5 构建，针对 Formulago 的 RBAC 权限系统进行了定制适配。

### 技术栈

- **框架**: Vue 3 + Vite + TypeScript
- **UI**: Tailwind CSS
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP**: axios
- **国际化**: vue-i18n

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产包
pnpm build
```

## 相关项目

- [Formulago](https://github.com/chenghonour/formulago) — Go 后端 (Hertz + Ent + Casbin + JWT)

## 浏览器支持

支持现代浏览器（Safari 16.4+、Chrome 111+、Firefox 128+），不支持 IE。

## 许可证

[MIT](./LICENSE)
