/** 后端 OAuth 提供商 */
export interface ProviderInfo {
  id: number;
  name: string;
  clientID: string;
  clientSecret: string;
  redirectUrl: string;
  scopes: string;
  authUrl: string;
  tokenUrl: string;
  authStyle: number;
  infoUrl: string;
  createdAt: string;
  updatedAt: string;
}

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

/** 提供商列表响应 */
export interface ProviderListResp {
  errCode?: number;
  errMsg?: string;
  total?: number;
  data?: ProviderInfo[];
}
