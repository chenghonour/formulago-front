import type { BackendPageResult, BackendRoleInfo } from '@formulago/types';

import { requestClient } from '#/api/request';

/** 角色创建/更新请求 */
export interface CreateOrUpdateRoleReq {
  ID?: number;
  name?: string;
  value?: string;
  defaultRouter?: string;
  status?: number;
  remark?: string;
  orderNo?: number;
}

/** 角色列表查询参数 */
export interface RoleListReq {
  page: number;
  pageSize: number;
  name?: string;
  status?: string;
}

/**
 * 获取角色列表
 */
export async function getRoleListApi(params: RoleListReq) {
  return requestClient.post<BackendPageResult<BackendRoleInfo>>(
    '/admin/role/list',
    params,
  );
}

/**
 * 获取角色详情
 */
export async function getRoleByIdApi(id: number) {
  return requestClient.get<BackendRoleInfo>('/admin/role', {
    params: { ID: id },
  });
}

/**
 * 创建角色
 */
export async function createRoleApi(data: CreateOrUpdateRoleReq) {
  return requestClient.post('/admin/role/create', data);
}

/**
 * 更新角色
 */
export async function updateRoleApi(data: CreateOrUpdateRoleReq) {
  return requestClient.post('/admin/role/update', data);
}

/**
 * 删除角色
 */
export async function deleteRoleApi(id: number) {
  return requestClient.delete('/admin/role', { params: { ID: id } });
}

/**
 * 更新角色状态
 */
export async function updateRoleStatusApi(id: number, status: number) {
  return requestClient.post('/admin/role/status', { ID: id, status });
}
