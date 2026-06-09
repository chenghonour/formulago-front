/** 后端角色信息 */
export interface RoleInfo {
  ID: number;
  name: string;
  value: string;
  defaultRouter: string;
  status: number;
  remark: string;
  orderNo: number;
  createdAt: string;
  updatedAt: string;
}

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

/** 角色列表响应 */
export interface RoleListResp {
  errCode?: number;
  errMsg?: string;
  total?: number;
  data?: RoleInfo[];
}

/** 角色详情响应 */
export interface RoleInfoResp {
  errCode?: number;
  errMsg?: string;
  ID?: number;
  name?: string;
  value?: string;
  defaultRouter?: string;
  status?: number;
  remark?: string;
  orderNo?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StatusCodeReq {
  ID?: number;
  status?: number;
}
