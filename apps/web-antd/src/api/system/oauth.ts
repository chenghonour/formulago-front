
import type { BaseIdReq, BasePageReq } from '../model/baseModel';
import type {
  CreateOrUpdateProviderReq,
  ProviderListResp,
} from './model/oauthModel';

import { requestClient } from '#/api/request';

/**
 * 获取 OAuth 提供商列表
 */
export async function getProviderListApi(params: BasePageReq) {
  return requestClient.post<ProviderListResp>(
    '/admin/oauth/provider/list',
    params,
  );
}

/**
 * 创建 OAuth 提供商
 */
export async function createProviderApi(params: CreateOrUpdateProviderReq) {
  return requestClient.post('/admin/oauth/provider/create', params);
}

/**
 * 更新 OAuth 提供商
 */
export async function updateProviderApi(params: CreateOrUpdateProviderReq) {
  return requestClient.post('/admin/oauth/provider/update', params);
}

/**
 * 删除 OAuth 提供商
 */
export async function deleteProviderApi(params: BaseIdReq) {
  return requestClient.delete('/admin/oauth/provider', {
    params,
  });
}
