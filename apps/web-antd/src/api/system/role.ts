import type { BaseIdReq } from '../model/baseModel';
import type {
  CreateOrUpdateRoleReq,
  RoleInfo,
  RoleListReq,
  RoleListResp,
  StatusCodeReq,
} from './model/roleModel';

import { requestClient } from '#/api/request';

/**
 * 获取角色列表
 */
export async function getRoleListApi(params: RoleListReq) {
  return requestClient.post<RoleListResp>('/admin/role/list', params);
}

/**
 * 获取角色详情
 */
export async function getRoleByIdApi(params: BaseIdReq) {
  return requestClient.get<RoleInfo>('/admin/role', {
    params,
  });
}

/**
 * 创建角色
 */
export async function createRoleApi(params: CreateOrUpdateRoleReq) {
  return requestClient.post('/admin/role/create', params);
}

/**
 * 更新角色
 */
export async function updateRoleApi(params: CreateOrUpdateRoleReq) {
  return requestClient.post('/admin/role/update', params);
}

/**
 * 删除角色
 */
export async function deleteRoleApi(params: BaseIdReq) {
  return requestClient.delete('/admin/role', { params });
}

/**
 * 更新角色状态
 */
export async function updateRoleStatusApi(params: StatusCodeReq) {
  return requestClient.post('/admin/role/status', params);
}
