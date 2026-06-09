/** 后端 API 信息 */
export interface ApiInfo {
  ID: number;
  createdAt: string;
  updatedAt: string;
  path: string;
  description: string;
  group: string;
  method: string;
}

/** 后端 API 权限信息 */
export interface ApiAuthorityInfo {
  path: string;
  method: string;
}

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

/** API 列表响应 */
export interface ApiListResp {
  errCode?: number;
  errMsg?: string;
  total?: number;
  data?: ApiInfo[];
}

/** API 授权列表响应 */
export interface ApiAuthorityListInfoResp {
  errCode?: number;
  errMsg?: string;
  total?: number;
  data?: ApiAuthorityInfo[];
}

/** 菜单授权响应 */
export interface MenuAuthorityInfoResp {
  errCode?: number;
  errMsg?: string;
  roleID?: number;
  MenuIDs?: number[];
}

// Create or update api authorization information request | 创建或更新API授权信息
export interface CreateOrUpdateApiAuthorityReq {
  roleID?: number;
  data?: ApiAuthorityInfo[];
}

// The request data of menu authorization | 菜单授权请求数据
export interface MenuAuthorityInfoReq {
  roleID?: number;
  MenuIDs?: number[];
}
