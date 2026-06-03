import type { BackendApiInfo, BackendPageResult } from '@formulago/types';

import { requestClient } from '#/api/request';

/** API 查询参数 */
export interface ApiListReq {
  page: number;
  pageSize: number;
  path?: string;
  description?: string;
  method?: string;
  group?: string;
}

/** API 创建/更新请求 */
export interface CreateOrUpdateApiReq {
  ID?: number;
  path?: string;
  description?: string;
  group?: string;
  method?: string;
}

/**
 * 获取 API 列表
 */
export async function getApiListApi(params: ApiListReq) {
  return requestClient.post<BackendPageResult<BackendApiInfo>>(
    '/admin/api/list',
    params,
  );
}

/**
 * 创建 API
 */
export async function createApiApi(data: CreateOrUpdateApiReq) {
  return requestClient.post('/admin/api/create', data);
}

/**
 * 更新 API
 */
export async function updateApiApi(data: CreateOrUpdateApiReq) {
  return requestClient.post('/admin/api/update', data);
}

/**
 * 删除 API
 */
export async function deleteApiApi(id: number) {
  return requestClient.delete('/admin/api', { params: { ID: id } });
}
