import type { BasePageReq } from "#/api/model/baseModel";

/** 后端 Token 信息 */
export interface TokenInfo {
  ID: number;
  createdAt: string;
  updatedAt: string;
  userID: number;
  userName: string;
  token: string;
  source: string;
  expiredAt: string;
}

/** Token 查询参数 */
export interface TokenListReq extends BasePageReq {
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

/** Token 列表响应 */
export interface TokenListResp {
  errCode?: number;
  errMsg?: string;
  total?: number;
  data?: TokenInfo[];
}
