import type { VbenFormSchema } from '#/adapter/form';
import type { TokenInfo } from '#/api/system/model/tokenModel';

import { $t } from '#/locales';

/** 创建默认表单值 */
export function createDefaultForm(): Partial<TokenInfo> {
  return {
    ID: undefined,
    token: '',
    source: '',
    expiredAt: '',
  };
}

/** 表格列定义 */
export const tokenColumns = [
  { field: 'ID', title: 'ID', width: 80 },
  { field: 'userName', title: $t('system.column.username'), width: 120 },
  { field: 'token', title: $t('system.column.token'), minWidth: 200 },
  { field: 'source', title: $t('system.column.source'), width: 100 },
  { field: 'expiredAt', title: $t('system.column.expiredAt'), width: 180 },
  { field: 'createdAt', title: $t('system.column.createdAt'), width: 180 },
  {
    field: 'action',
    title: $t('system.column.action'),
    width: 200,
    slots: { default: 'actionSlot' },
  },
];

/** 搜索表单定义 */
export const tokenSearchSchemas: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'username',
    label: $t('system.column.username'),
    componentProps: { placeholder: $t('system.token.placeholder.username') },
  },
];

/** 抽屉表单定义 */
export const tokenFormSchemas: VbenFormSchema[] = [
  {
    fieldName: 'token',
    component: 'Input',
    label: $t('system.column.token'),
    formItemClass: 'col-span-6',
  },
  {
    fieldName: 'source',
    component: 'Input',
    label: $t('system.column.source'),
    formItemClass: 'col-span-6',
  },
  {
    fieldName: 'expiredAt',
    component: 'Input',
    label: $t('system.column.expiredAt'),
    formItemClass: 'col-span-6',
  },
];
