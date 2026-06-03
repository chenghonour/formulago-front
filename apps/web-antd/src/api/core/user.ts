import type { BackendUserInfo, UserInfo, BackendPageReq, BackendPageResult } from '@formulago/types';

import { requestClient } from '#/api/request';

/**
 * 获取当前用户信息
 */
export async function getUserInfoApi() {
  const user = await requestClient.get<BackendUserInfo>(
    '/admin/user/info',
  );
  const homePath = user.defaultRouter || '/dashboard';

  return {
    userId: String(user.ID),
    username: user.username,
    realName: user.nickname,
    avatar: user.avatar,
    roles: user.roleName ? [user.roleName] : [],
    desc: '',
    homePath,
    token: '',
  } as UserInfo;
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
export interface UserListReq extends BackendPageReq {
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

/**
 * 获取用户列表
 */
export async function getUserListApi(params: UserListReq) {
  return requestClient.post<BackendPageResult<BackendUserInfo>>(
    '/admin/user/list',
    params,
  );
}

/**
 * 创建用户
 */
export async function createUserApi(data: CreateOrUpdateUserReq) {
  return requestClient.post('/admin/user/create', data);
}

/**
 * 更新用户
 */
export async function updateUserApi(data: CreateOrUpdateUserReq) {
  return requestClient.post('/admin/user/update', data);
}

/**
 * 删除用户
 */
export async function deleteUserApi(id: number) {
  return requestClient.delete('/admin/user', { params: { ID: id } });
}

/**
 * 更新用户状态
 */
export async function updateUserStatusApi(id: number, status: number) {
  return requestClient.post('/admin/user/status', {
    ID: id,
    status,
  });
}

/**
 * 修改密码
 */
export async function changePasswordApi(data: ChangePasswordReq) {
  return requestClient.post('/admin/user/change-password', data);
}

/**
 * 更新个人信息
 */
export async function updateProfileApi(data: ProfileReq) {
  return requestClient.post('/admin/user/profile', data);
}

/**
 * 获取个人信息
 */
export async function getUserProfileApi() {
  return requestClient.get<BackendUserInfo>('/admin/user/profile');
}
