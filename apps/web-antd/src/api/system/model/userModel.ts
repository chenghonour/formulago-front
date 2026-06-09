import type { BasePageReq } from "#/api/model/baseModel";

/** 后端用户信息 */
export interface BackendUserInfo {
  ID?: number;
  avatar?: string;
  roleID?: number;
  mobile?: string;
  email?: string;
  status?: number;
  username?: string;
  nickname?: string;
  roleName?: string;
  createdAt?: string;
  updatedAt?: string;
  roleValue?: string;
  sideMode?: string;
  defaultRouter?: string;
}

/** 创建/更新用户请求 */
export interface CreateOrUpdateUserReq {
  ID?: number;
  avatar?: string;
  roleID?: number;
  mobile?: string;
  email?: string;
  status?: number;
  username?: string;
  nickname?: string;
  password?: string;
}

/** 用户列表查询参数 */
export interface UserListReq extends BasePageReq {
  username?: string;
  nickname?: string;
  email?: string;
  mobile?: string;
  roleID?: number;
}

/** 修改密码请求 */
export interface ChangePasswordReq {
  userID: number;
  oldPassword: string;
  newPassword: string;
}

/** 更新个人信息请求 */
export interface ProfileReq {
  nickname?: string;
  avatar?: string;
  mobile?: string;
  email?: string;
}

/** 用户列表响应 */
export interface UserListResp {
  errCode?: number;
  errMsg?: string;
  total?: number;
  data?: BackendUserInfo[];
}
