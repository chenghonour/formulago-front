import type { RouteMeta, RouteRecordStringComponent } from '@formulago/types';

import type { MenuInfo } from '../system/model/menuModel';

import { requestClient } from '#/api/request';

/**
 * 将后端 MenuInfo 转换为前端 RouteRecordStringComponent
 */
function transformMenu(backendMenu: MenuInfo): RouteRecordStringComponent {
  const meta: RouteMeta = {
    title: backendMenu.meta?.title || backendMenu.name || '',
    titleEn: backendMenu.name,
    icon: backendMenu.meta?.icon || undefined,
    order: backendMenu.orderNo ?? undefined,
    hideInMenu: backendMenu.meta?.hideMenu || undefined,
    hideInBreadcrumb: backendMenu.meta?.hideBreadcrumb || undefined,
    keepAlive: backendMenu.meta ? !backendMenu.meta.ignoreKeepAlive : undefined,
    affixTab: backendMenu.meta?.affix || undefined,
    iframeSrc: backendMenu.meta?.frameSrc || undefined,
    hideChildrenInMenu: backendMenu.meta?.hideChildrenInMenu || undefined,
  };

  const route: RouteRecordStringComponent = {
    name: backendMenu.name,
    path: backendMenu.path || '',
    component:
      backendMenu.menuType === 0 && backendMenu.children?.length
        ? 'BasicLayout'
        : backendMenu.component || '',
    redirect: backendMenu.redirect || undefined,
    meta,
  };

  if (backendMenu.children && backendMenu.children.length > 0) {
    route.children = backendMenu.children
      .filter((child) => child.menuType !== 2)
      .map((item) => transformMenu(item));
  }

  return route;
}

/**
 * 获取当前角色菜单树
 */
export async function getAllMenusApi() {
  const result = await requestClient.get<MenuInfo[]>('/admin/menu/role');
  // 兼容分页响应格式：{ total, data, errCode } 返回完整对象，需提取 data
  const menuData = Array.isArray(result)
    ? result
    : ((result as Record<string, any>)?.data ?? []);
  let routes = (menuData as MenuInfo[])
    // 过滤按钮类型（menuType=2），按钮仅用于权限标识，不生成路由
    .filter((menu) => menu.menuType !== 2)
    .map((item) => transformMenu(item));

  // 剥离根包装节点（path='' 且 name='root' 的顶层目录），直接使用其子路由
  if (routes.length === 1) {
    const first = routes[0];
    if (first?.name === 'root' || (!first?.path && !!first?.children?.length)) {
      routes = first.children ?? [];
    }
  }

  return routes;
}
