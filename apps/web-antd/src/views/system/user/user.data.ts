import type { VbenFormSchema } from '#/adapter/form';
import type { BackendUserInfo } from '#/api/system/model/userModel';

import { $t } from '#/locales';

/** 创建默认表单值（password 仅传表单使用，不在 BackendUserInfo 中） */
export function createDefaultForm(): Partial<BackendUserInfo> & { password?: string } {
  return {
    ID: undefined,
    username: '',
    nickname: '',
    password: '',
    email: '',
    mobile: '',
    roleID: undefined,
    avatar: '',
    status: 1,
  };
}

/** 表格列定义 */
export const userColumns = [
  { field: 'ID', title: 'ID', width: 80 },
  { field: 'username', title: $t('system.column.username'), width: 120 },
  { field: 'nickname', title: $t('system.column.nickname'), width: 120 },
  { field: 'roleName', title: $t('system.column.roleName'), width: 120 },
  { field: 'email', title: $t('system.column.email'), minWidth: 180 },
  { field: 'mobile', title: $t('system.column.mobile'), width: 140 },
  {
    field: 'status',
    title: $t('system.column.status'),
    width: 100,
    slots: { default: 'statusSlot' },
  },
  { field: 'createdAt', title: $t('system.column.createdAt'), width: 180 },
  {
    field: 'action',
    title: $t('system.column.action'),
    width: 200,
    slots: { default: 'actionSlot' },
  },
];

/** 搜索表单定义 */
export const userSearchSchemas: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'username',
    label: $t('system.column.username'),
    componentProps: { placeholder: $t('system.user.placeholder.username') },
  },
  {
    component: 'Input',
    fieldName: 'nickname',
    label: $t('system.column.nickname'),
    componentProps: { placeholder: $t('system.user.placeholder.nickname') },
  },
  {
    component: 'Input',
    fieldName: 'email',
    label: $t('system.column.email'),
    componentProps: { placeholder: $t('system.user.placeholder.email') },
  },
  {
    component: 'Input',
    fieldName: 'mobile',
    label: $t('system.column.mobile'),
    componentProps: { placeholder: $t('system.user.placeholder.mobile') },
  },
];

/** 抽屉表单定义 */
export const userFormSchemas: VbenFormSchema[] = [
  {
    fieldName: 'username',
    component: 'Input',
    label: $t('system.column.username'),
    formItemClass: 'col-span-3',
    componentProps: { placeholder: $t('system.user.placeholder.username') },
  },
  {
    fieldName: 'nickname',
    component: 'Input',
    label: $t('system.column.nickname'),
    formItemClass: 'col-span-3',
    componentProps: { placeholder: $t('system.user.placeholder.nickname') },
  },
  {
    fieldName: 'password',
    component: 'InputPassword',
    label: $t('system.column.password'),
    formItemClass: 'col-span-3',
    componentProps: {
      placeholder: $t('system.placeholder.input'),
      autocomplete: 'new-password',
    },
  },
  {
    fieldName: 'email',
    component: 'Input',
    label: $t('system.column.email'),
    formItemClass: 'col-span-3',
    componentProps: { placeholder: $t('system.user.placeholder.email') },
  },
  {
    fieldName: 'mobile',
    component: 'Input',
    label: $t('system.column.mobile'),
    formItemClass: 'col-span-3',
    componentProps: { placeholder: $t('system.user.placeholder.mobile') },
    rules: 'required',
  },
  {
    fieldName: 'roleID',
    component: 'Select',
    label: $t('system.column.roleID'),
    formItemClass: 'col-span-3',
    componentProps: {
      placeholder: $t('system.placeholder.select'),
      options: [],
      allowClear: true,
      style: { width: '100%' },
    },
    rules: 'required',
  },
  {
    fieldName: 'status',
    component: 'Switch',
    label: $t('system.column.status'),
    formItemClass: 'col-span-2',
  },
];
