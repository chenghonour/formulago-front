import type { BaseIdReq } from '../model/baseModel';
import type {
  CreateOrUpdateMenuReq,
  MenuInfoListResp,
  MenuListReq,
} from './model/menuModel';

import { requestClient } from '#/api/request';

/**
 * 获取菜单列表（管理用）
 */
export async function getMenuListApi(params: MenuListReq) {
  return requestClient.post<MenuInfoListResp>('/admin/menu/list', params);
}

/**
 * 创建菜单
 */
export async function createMenuApi(params: CreateOrUpdateMenuReq) {
  return requestClient.post('/admin/menu/create', params);
}

/**
 * 更新菜单
 */
export async function updateMenuApi(params: CreateOrUpdateMenuReq) {
  return requestClient.post('/admin/menu/update', params);
}

/**
 * 删除菜单
 */
export async function deleteMenuApi(params: BaseIdReq) {
  return requestClient.delete('/admin/menu', { params });
}
