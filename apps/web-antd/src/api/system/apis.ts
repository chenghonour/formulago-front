
import type {
  ApiListReq,
  ApiListResp,
  CreateOrUpdateApiReq,
} from './model/apiModel';

import { requestClient } from '#/api/request';

/**
 * 获取 API 列表
 */
export async function getApiListApi(params: ApiListReq) {
  return requestClient.post<ApiListResp>('/admin/api/list', params);
}

/**
 * 创建 API
 */
export async function createApiApi(params: CreateOrUpdateApiReq) {
  return requestClient.post('/admin/api/create', params);
}

/**
 * 更新 API
 */
export async function updateApiApi(params: CreateOrUpdateApiReq) {
  return requestClient.post('/admin/api/update', params);
}

/**
 * 删除 API
 */
export async function deleteApiApi(id: number) {
  return requestClient.delete('/admin/api', { params: { ID: id } });
}
