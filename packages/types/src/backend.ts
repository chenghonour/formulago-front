/** 后端 BaseResp 格式 */
export interface BackendBaseResp {
  errCode: number;
  errMsg: string;
  [key: string]: any;
}

/** 后端分页响应 */
export interface BackendPageResult<T> {
  total: number;
  data: T[];
}

/** 后端用户信息 */
export interface BackendUserInfo {
  ID: number;
  avatar: string;
  roleID: number;
  mobile: string;
  email: string;
  status: number;
  username: string;
  nickname: string;
  roleName: string;
  createdAt: string;
  updatedAt: string;
  roleValue: string;
  sideMode: string;
  defaultRouter: string;
}

/** 后端角色信息 */
export interface BackendRoleInfo {
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

/** 后端 API 信息 */
export interface BackendApiInfo {
  ID: number;
  createdAt: string;
  updatedAt: string;
  path: string;
  description: string;
  group: string;
  method: string;
}

/** 后端 API 权限信息 */
export interface BackendApiAuthorityInfo {
  path: string;
  method: string;
}

/** 后端菜单 Meta */
export interface BackendMenuMeta {
  title: string;
  icon: string;
  hideMenu: boolean;
  hideBreadcrumb: boolean;
  currentActiveMenu: string;
  ignoreKeepAlive: boolean;
  hideTab: boolean;
  frameSrc: string;
  carryParam: boolean;
  hideChildrenInMenu: boolean;
  affix: boolean;
  dynamicLevel: string;
  realPath: string;
}

/** 后端菜单信息 */
export interface BackendMenuInfo {
  ID: number;
  parentID: number;
  level: number;
  path: string;
  name: string;
  redirect: string;
  component: string;
  orderNo: number;
  disabled: boolean;
  menuType: number;
  children?: BackendMenuInfo[];
  meta: BackendMenuMeta;
}

/** 后端 Token 信息 */
export interface BackendTokenInfo {
  ID: number;
  createdAt: string;
  updatedAt: string;
  userID: number;
  userName: string;
  token: string;
  source: string;
  expiredAt: string;
}

/** 后端字典信息 */
export interface BackendDictionaryInfo {
  ID: number;
  title: string;
  name: string;
  status: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/** 后端字典明细 */
export interface BackendDictionaryDetail {
  ID: number;
  title: string;
  key: string;
  value: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  parentID: number;
}

/** 后端 OAuth 提供商 */
export interface BackendProviderInfo {
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

/** 后端操作日志 */
export interface BackendLogsInfo {
  type: string;
  method: string;
  api: string;
  success: boolean;
  reqContent: string;
  respContent: string;
  ip: string;
  userAgent: string;
  operator: string;
  time: string;
  createdAt: string;
  updatedAt: string;
}

/** 后端分页请求 */
export interface BackendPageReq {
  page: number;
  pageSize: number;
}
