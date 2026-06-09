import type { VbenFormSchema } from '#/adapter/form';
import type { ProviderInfo } from '#/api/system/model/oauthModel';

import { $t } from '#/locales';

/** 创建默认表单值 */
export function createDefaultForm(): Partial<ProviderInfo> {
  return {
    id: undefined,
    name: '',
    clientID: '',
    clientSecret: '',
    redirectUrl: '',
    scopes: '',
    authUrl: '',
    tokenUrl: '',
    authStyle: 0,
    infoUrl: '',
  };
}

/** 表格列定义 */
export const oauthColumns = [
  { field: 'id', title: $t('system.column.id'), width: 80 },
  { field: 'name', title: $t('system.column.name'), width: 150 },
  { field: 'clientID', title: $t('system.column.clientID'), width: 200 },
  { field: 'authUrl', title: $t('system.column.authUrl'), minWidth: 200 },
  { field: 'tokenUrl', title: $t('system.column.tokenUrl'), minWidth: 200 },
  {
    field: 'action',
    title: $t('system.column.action'),
    width: 200,
    slots: { default: 'actionSlot' },
  },
];

/** 抽屉表单定义 */
export const oauthFormSchemas: VbenFormSchema[] = [
  {
    fieldName: 'name',
    component: 'Input',
    label: $t('system.column.name'),
    formItemClass: 'col-span-3',
  },
  {
    fieldName: 'clientID',
    component: 'Input',
    label: $t('system.column.clientID'),
    formItemClass: 'col-span-3',
  },
  {
    fieldName: 'clientSecret',
    component: 'InputPassword',
    label: $t('system.column.clientSecret'),
    formItemClass: 'col-span-6',
  },
  {
    fieldName: 'redirectUrl',
    component: 'Input',
    label: $t('system.column.redirectUrl'),
    formItemClass: 'col-span-6',
  },
  {
    fieldName: 'authUrl',
    component: 'Input',
    label: $t('system.column.authUrl'),
    formItemClass: 'col-span-3',
  },
  {
    fieldName: 'tokenUrl',
    component: 'Input',
    label: $t('system.column.tokenUrl'),
    formItemClass: 'col-span-3',
  },
  {
    fieldName: 'infoUrl',
    component: 'Input',
    label: $t('system.column.infoUrl'),
    formItemClass: 'col-span-3',
  },
  {
    fieldName: 'scopes',
    component: 'Input',
    label: $t('system.column.scopes'),
    formItemClass: 'col-span-3',
  },
];
