import type { BasePageReq } from "#/api/model/baseModel";

export interface CreateOrUpdateMenuReq {
  ID?: number;
  parentID?: number;
  level?: number;
  path?: string;
  name?: string;
  redirect?: string;
  component?: string;
  orderNo?: number;
  disabled?: boolean;
  menuType?: number;
  meta?: MenuMeta;
}

// The response data of menu information | 菜单返回数据
export interface MenuInfo {
  ID?: number;
  createdAt?: string;
  updatedAt?: string;
  level?: number;
  parentID?: number;
  path?: string;
  name?: string;
  redirect?: string;
  component?: string;
  orderNo?: number;
  disabled?: boolean;
  menuType?: number;
  children?: MenuInfo[];
  meta?: MenuMeta;
}

// The meta data of menu | 菜单的meta数据
export interface MenuMeta {
  title?: string;
  icon?: string;
  hideMenu?: boolean;
  hideBreadcrumb?: boolean;
  currentActiveMenu?: string;
  ignoreKeepAlive?: boolean;
  hideTab?: boolean;
  frameSrc?: string;
  carryParam?: boolean;
  hideChildrenInMenu?: boolean;
  affix?: boolean;
  dynamicLevel?: number;
  realPath?: string;
}

// The request data of menu list | 菜单列表请求数据
export interface MenuListReq extends BasePageReq {
  name?: string;
  title?: string;
}

// The data of menu list | 菜单列表数据
export interface MenuInfoListResp {
  errCode?: number;
  errMsg?: string;
  total?: number;
  data?: MenuInfo[];
}

// The response data of role menu list data | 角色菜单列表数据
export interface MenuListBase {
  parentID?: number;
  level?: number;
  path?: string;
  name?: string;
  redirect?: string;
  component?: string;
  orderNo?: number;
  disabled?: boolean;
  children?: MenuListBase[];
  meta?: MenuMeta;
}

