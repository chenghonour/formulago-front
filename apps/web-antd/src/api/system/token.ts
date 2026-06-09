import type {
  TokenListReq,
  TokenListResp,
  UpdateTokenReq,
} from './model/tokenModel';

import { requestClient } from '#/api/request';

/**
 * 获取 Token 列表
 */
export async function getTokenListApi(params: TokenListReq) {
  return requestClient.post<TokenListResp>('/admin/token/list', params);
}

/**
 * 更新 Token
 */
export async function updateTokenApi(params: UpdateTokenReq) {
  return requestClient.post('/admin/token/update', params);
}

/**
 * 删除用户 Token
 */
export async function deleteTokenApi(userID: number) {
  return requestClient.delete('/admin/token', {
    data: { userID },
  });
}
