import type { BackendPageReq, BackendPageResult, BackendTokenInfo } from '@formulago/types';

import { requestClient } from '#/api/request';

/** Token 查询参数 */
export interface TokenListReq extends BackendPageReq {
  username?: string;
  userID?: number;
}

/** Token 更新请求 */
export interface UpdateTokenReq {
  ID?: number;
  token?: string;
  source?: string;
  expiredAt?: string;
}

/**
 * 获取 Token 列表
 */
export async function getTokenListApi(params: TokenListReq) {
  return requestClient.post<BackendPageResult<BackendTokenInfo>>(
    '/admin/token/list',
    params,
  );
}

/**
 * 更新 Token
 */
export async function updateTokenApi(data: UpdateTokenReq) {
  return requestClient.post('/admin/token/update', data);
}

/**
 * 删除用户 Token
 */
export async function deleteTokenApi(userID: number) {
  return requestClient.delete('/admin/token', {
    data: { userID },
  });
}
