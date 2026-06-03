import type { BackendMenuInfo, BackendMenuMeta, BackendPageResult } from '@formulago/types';

import { requestClient } from '#/api/request';

/** 菜单创建/更新请求 */
export interface CreateOrUpdateMenuReq {
  ID?: number;
  parentID?: number;
  level?: number;
  path?: string;
  name?: string;
  redirect?: string;
  component?: string;
  orderNo?: number;
  disabled?: boolean;
  menuType?: number;
  meta?: Partial<BackendMenuMeta>;
}

/** 菜单列表查询参数 */
export interface MenuListReq {
  page: number;
  pageSize: number;
  name?: string;
  title?: string;
}

/**
 * 获取菜单列表（管理用）
 */
export async function getMenuListApi(params: MenuListReq) {
  return requestClient.post<BackendPageResult<BackendMenuInfo>>(
    '/admin/menu/list',
    params,
  );
}

/**
 * 创建菜单
 */
export async function createMenuApi(data: CreateOrUpdateMenuReq) {
  return requestClient.post('/admin/menu/create', data);
}

/**
 * 更新菜单
 */
export async function updateMenuApi(data: CreateOrUpdateMenuReq) {
  return requestClient.post('/admin/menu/update', data);
}

/**
 * 删除菜单
 */
export async function deleteMenuApi(id: number) {
  return requestClient.delete('/admin/menu', { params: { ID: id } });
}
