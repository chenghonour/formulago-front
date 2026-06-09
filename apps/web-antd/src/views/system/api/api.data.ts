import type { VbenFormSchema } from '#/adapter/form';
import type { ApiInfo } from '#/api/system/model/apiModel';

import { $t } from '#/locales';

/** 请求方式选项 */
export const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
];

/** 搜索表单请求方式选项（含"全部"） */
export const searchMethodOptions = [
  { label: $t('system.httpMethod.all'), value: '' },
  ...methodOptions,
];

/** 创建默认表单值 */
export function createDefaultForm(): Partial<ApiInfo> {
  return {
    ID: undefined,
    path: '',
    description: '',
    group: '',
    method: 'GET',
  };
}

/** 表格列定义 */
export const apiColumns = [
  { field: 'ID', title: 'ID', width: 80 },
  { field: 'path', title: $t('system.column.path'), minWidth: 200 },
  { field: 'description', title: $t('system.column.description'), width: 150 },
  { field: 'group', title: $t('system.column.group'), width: 120 },
  { field: 'method', title: $t('system.column.method'), width: 100 },
  {
    field: 'action',
    title: $t('system.column.action'),
    width: 200,
    slots: { default: 'actionSlot' },
  },
];

/** 搜索表单定义 */
export const apiSearchSchemas: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'path',
    label: $t('system.column.path'),
    componentProps: { placeholder: $t('system.api.placeholder.path') },
  },
  {
    component: 'Input',
    fieldName: 'description',
    label: $t('system.column.description'),
    componentProps: { placeholder: $t('system.api.placeholder.description') },
  },
  {
    component: 'Input',
    fieldName: 'group',
    label: $t('system.column.group'),
    componentProps: { placeholder: $t('system.api.placeholder.group') },
  },
  {
    component: 'Select',
    fieldName: 'method',
    label: $t('system.column.method'),
    componentProps: {
      placeholder: $t('system.api.placeholder.method'),
      options: searchMethodOptions,
    },
  },
];

/** 抽屉表单定义 */
export const apiFormSchemas: VbenFormSchema[] = [
  {
    fieldName: 'path',
    component: 'Input',
    label: $t('system.column.path'),
    formItemClass: 'col-span-6',
    componentProps: { placeholder: $t('system.api.placeholder.path') },
    rules: 'required',
  },
  {
    fieldName: 'description',
    component: 'Input',
    label: $t('system.column.description'),
    formItemClass: 'col-span-6',
    componentProps: { placeholder: $t('system.api.placeholder.description') },
    rules: 'required',
  },
  {
    fieldName: 'group',
    component: 'Input',
    label: $t('system.column.group'),
    formItemClass: 'col-span-6',
    componentProps: { placeholder: $t('system.api.placeholder.group') },
    rules: 'required',
  },
  {
    fieldName: 'method',
    component: 'Select',
    label: $t('system.column.method'),
    formItemClass: 'col-span-6',
    componentProps: {
      placeholder: $t('system.api.placeholder.method'),
      options: methodOptions,
      style: { width: '100%' },
    },
    rules: 'required',
  },
];
