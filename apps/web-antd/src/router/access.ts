import type { RouteRecordRaw } from 'vue-router';

import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@formulago/types';

import { generateMenus, mapTree } from '@formulago/utils';

import { message } from 'ant-design-vue';

import { getAllMenusApi } from '#/api';
import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

function normalizeViewPath(path: string): string {
  const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '');
  const viewPath = normalizedPath.startsWith('/')
    ? normalizedPath
    : `/${normalizedPath}`;
  return viewPath.replace(/^\/views/, '');
}

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  const { router } = options;

  // 获取后端菜单数据
  message.loading({
    content: `${$t('common.loadingMenu')}...`,
    duration: 1.5,
  });
  const menuRoutes = await getAllMenusApi();
  let accessibleRoutes = menuRoutes || [];

  // 标准化 pageMap 的 key
  const normalizePageMap: ComponentRecordType = {};
  for (const [key, value] of Object.entries(pageMap)) {
    normalizePageMap[normalizeViewPath(key)] = value;
  }

  // 解析组件字符串为实际组件，并处理 redirect
  accessibleRoutes = mapTree(accessibleRoutes, (route) => {
    const comp = route.component as string | undefined;
    if (comp) {
      if (layoutMap[comp]) {
        route.component = layoutMap[comp] as any;
      } else {
        const normalizedKey = normalizeViewPath(comp);
        const pageKey = normalizedKey.endsWith('.vue')
          ? normalizedKey
          : `${normalizedKey}.vue`;
        route.component = (
          normalizePageMap[pageKey] ||
          normalizePageMap['/_core/fallback/not-found.vue']
        ) as any;
      }
    }

    // 为有子路由但没有 redirect 的父路由添加 redirect
    if (!route.redirect && route.children && route.children.length > 0) {
      const firstChild = route.children[0];
      if (firstChild?.path && firstChild.path.startsWith('/')) {
        route.redirect = firstChild.path;
      }
    }

    return route;
  });

  // 动态添加路由到 router 实例
  for (const route of accessibleRoutes) {
    if (route.children && route.children.length > 0) {
      (route as { component?: string }).component = undefined;
    }
    router.addRoute('Root', route as unknown as RouteRecordRaw);
  }

  // 生成菜单
  const accessibleMenus = generateMenus(
    accessibleRoutes as unknown as RouteRecordRaw[],
    router,
  );

  return { accessibleMenus, accessibleRoutes };
}

export { generateAccess };
