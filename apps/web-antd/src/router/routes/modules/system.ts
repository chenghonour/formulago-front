import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const systemRoutes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'system',
      order: 1000,
      title: '系统管理',
      titleEn: 'System Management',
    },
    name: 'System',
    path: '/system',
    children: [
      {
        name: 'SystemUser',
        path: '/system/user',
        component: () => import('#/views/system/user/index.vue'),
        meta: { icon: 'user', title: '用户管理', titleEn: 'User Management' },
      },
      {
        name: 'SystemRole',
        path: '/system/role',
        component: () => import('#/views/system/role/index.vue'),
        meta: { icon: 'role', title: '角色管理', titleEn: 'Role Management' },
      },
      {
        name: 'SystemMenu',
        path: '/system/menu',
        component: () => import('#/views/system/menu/index.vue'),
        meta: { icon: 'menu', title: '菜单管理', titleEn: 'Menu Management' },
      },
      {
        name: 'SystemApi',
        path: '/system/api',
        component: () => import('#/views/system/api/index.vue'),
        meta: { icon: 'api', title: 'API管理', titleEn: 'API Management' },
      },
      {
        name: 'SystemAuthorityApi',
        path: '/system/authority/api',
        component: () => import('#/views/system/authority/api.vue'),
        meta: { icon: 'auth', title: 'API授权', titleEn: 'API Authorization' },
      },
      {
        name: 'SystemAuthorityMenu',
        path: '/system/authority/menu',
        component: () => import('#/views/system/authority/menu.vue'),
        meta: { icon: 'auth', title: '菜单授权', titleEn: 'Menu Authorization' },
      },
      {
        name: 'SystemDict',
        path: '/system/dict',
        component: () => import('#/views/system/dict/index.vue'),
        meta: { icon: 'dict', title: '字典管理', titleEn: 'Dictionary Management' },
      },
      {
        name: 'SystemOAuth',
        path: '/system/oauth',
        component: () => import('#/views/system/oauth/index.vue'),
        meta: { icon: 'oauth', title: 'OAuth管理', titleEn: 'OAuth Management' },
      },
      {
        name: 'SystemToken',
        path: '/system/token',
        component: () => import('#/views/system/token/index.vue'),
        meta: { icon: 'token', title: 'Token管理', titleEn: 'Token Management' },
      },
      {
        name: 'SystemLogs',
        path: '/system/logs',
        component: () => import('#/views/system/logs/index.vue'),
        meta: { icon: 'logs', title: '操作日志', titleEn: 'Operation Logs' },
      },
    ],
  },
];

export default systemRoutes;
