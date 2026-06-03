import type { BackendApiAuthorityInfo } from '@formulago/types';

import { requestClient } from '#/api/request';

/**
 * 创建 API 权限
 */
export async function createApiAuthorityApi(
  roleID: number,
  data: BackendApiAuthorityInfo[],
) {
  return requestClient.post('/admin/authority/api/create', {
    roleID,
    data,
  });
}

/**
 * 更新 API 权限
 */
export async function updateApiAuthorityApi(
  roleID: number,
  data: BackendApiAuthorityInfo[],
) {
  return requestClient.post('/admin/authority/api/update', {
    roleID,
    data,
  });
}

/**
 * 获取角色 API 权限
 */
export async function getApiAuthorityApi(roleID: number) {
  return requestClient.post<BackendApiAuthorityInfo[]>(
    '/admin/authority/api/role',
    { ID: roleID },
  );
}

/**
 * 创建菜单权限
 */
export async function createMenuAuthorityApi(
  roleID: number,
  menuIDs: number[],
) {
  return requestClient.post('/admin/authority/menu/create', {
    roleID,
    menuIDs,
  });
}

/**
 * 更新菜单权限
 */
export async function updateMenuAuthorityApi(
  roleID: number,
  menuIDs: number[],
) {
  return requestClient.post('/admin/authority/menu/update', {
    roleID,
    menuIDs,
  });
}

/**
 * 获取角色菜单权限
 */
export async function getMenuAuthorityApi(roleID: number) {
  return requestClient.post<{ roleID: number; menuIDs: number[] }>(
    '/admin/authority/menu/role',
    { ID: roleID },
  );
}
