import type { BaseIdReq } from '../model/baseModel';
import type {
  ApiAuthorityListInfoResp,
  CreateOrUpdateApiAuthorityReq,
  MenuAuthorityInfoReq,
  MenuAuthorityInfoResp,
} from './model/apiModel';

import { requestClient } from '#/api/request';

/**
 * 创建 API 权限
 */
export async function createApiAuthorityApi(
  params: CreateOrUpdateApiAuthorityReq,
) {
  return requestClient.post('/admin/authority/api/create', params);
}

/**
 * 更新 API 权限
 */
export async function updateApiAuthorityApi(
  params: CreateOrUpdateApiAuthorityReq,
) {
  return requestClient.post('/admin/authority/api/update', params);
}

/**
 * 获取角色 API 权限
 */
export async function getApiAuthorityApi(params: BaseIdReq) {
  return requestClient.post<ApiAuthorityListInfoResp>(
    '/admin/authority/api/role',
    params,
  );
}

/**
 * 创建菜单权限
 */
export async function createMenuAuthorityApi(
  params: MenuAuthorityInfoReq
) {
  return requestClient.post('/admin/authority/menu/create', params);
}

/**
 * 更新菜单权限
 */
export async function updateMenuAuthorityApi(
  params: MenuAuthorityInfoReq
) {
  return requestClient.post('/admin/authority/menu/update', params);
}

/**
 * 获取角色菜单权限
 */
export async function getMenuAuthorityApi(params: BaseIdReq) {
  return requestClient.post<MenuAuthorityInfoResp>(
    '/admin/authority/menu/role',
    params,
  );
}
