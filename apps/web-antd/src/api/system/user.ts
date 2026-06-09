import type { BaseIdReq } from '../model/baseModel';
import type { StatusCodeReq } from './model/roleModel';
import type {
  BackendUserInfo,
  ChangePasswordReq,
  CreateOrUpdateUserReq,
  ProfileReq,
  UserListReq,
  UserListResp,
} from './model/userModel';

import { requestClient } from '#/api/request';

/**
 * 获取当前用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<BackendUserInfo>('/admin/user/info');
}

/**
 * 获取用户列表
 */
export async function getUserListApi(params: UserListReq) {
  return requestClient.post<UserListResp>('/admin/user/list', params);
}

/**
 * 创建用户
 */
export async function createUserApi(params: CreateOrUpdateUserReq) {
  return requestClient.post('/admin/user/create', params);
}

/**
 * 更新用户
 */
export async function updateUserApi(params: CreateOrUpdateUserReq) {
  return requestClient.post('/admin/user/update', params);
}

/**
 * 删除用户
 */
export async function deleteUserApi(params: BaseIdReq) {
  return requestClient.delete('/admin/user', { params });
}

/**
 * 更新用户状态
 */
export async function updateUserStatusApi(params: StatusCodeReq) {
  return requestClient.post('/admin/user/status', params);
}

/**
 * 修改密码
 */
export async function changePasswordApi(params: ChangePasswordReq) {
  return requestClient.post('/admin/user/change-password', params);
}

/**
 * 更新个人信息
 */
export async function updateProfileApi(params: ProfileReq) {
  return requestClient.post('/admin/user/profile', params);
}

/**
 * 获取个人信息
 */
export async function getUserProfileApi() {
  return requestClient.get<BackendUserInfo>('/admin/user/profile');
}
