import type { BackendPageReq, BackendPageResult, BackendProviderInfo } from '@formulago/types';

import { requestClient } from '#/api/request';

/** OAuth 提供商创建/更新请求 */
export interface CreateOrUpdateProviderReq {
  id?: number;
  name?: string;
  clientID?: string;
  clientSecret?: string;
  redirectUrl?: string;
  scopes?: string;
  authUrl?: string;
  tokenUrl?: string;
  authStyle?: number;
  infoUrl?: string;
}

/**
 * 获取 OAuth 提供商列表
 */
export async function getProviderListApi(params: BackendPageReq) {
  return requestClient.post<BackendPageResult<BackendProviderInfo>>(
    '/admin/oauth/provider/list',
    params,
  );
}

/**
 * 创建 OAuth 提供商
 */
export async function createProviderApi(data: CreateOrUpdateProviderReq) {
  return requestClient.post('/admin/oauth/provider/create', data);
}

/**
 * 更新 OAuth 提供商
 */
export async function updateProviderApi(data: CreateOrUpdateProviderReq) {
  return requestClient.post('/admin/oauth/provider/update', data);
}

/**
 * 删除 OAuth 提供商
 */
export async function deleteProviderApi(id: number) {
  return requestClient.delete('/admin/oauth/provider', {
    params: { ID: id },
  });
}
