import type { VbenFormSchema } from '#/adapter/form';

import { $t } from '#/locales';

/** 请求方式选项 */
export const searchMethodOptions = [
  { label: $t('system.httpMethod.all'), value: '' },
  { label: $t('system.httpMethod.get'), value: 'GET' },
  { label: $t('system.httpMethod.post'), value: 'POST' },
  { label: $t('system.httpMethod.put'), value: 'PUT' },
  { label: $t('system.httpMethod.delete'), value: 'DELETE' },
];

/** 状态选项 */
export const statusOptions = [
  { label: $t('system.httpMethod.all'), value: '' },
  { label: $t('system.status.success'), value: 'true' },
  { label: $t('system.status.fail'), value: 'false' },
];

/** 表格列定义 */
export const logsColumns = [
  { field: 'type', title: $t('system.column.type'), width: 80 },
  { field: 'method', title: $t('system.column.method'), width: 100 },
  { field: 'api', title: $t('system.column.api') },
  { field: 'operator', title: $t('system.column.operator'), width: 120 },
  { field: 'ip', title: $t('system.column.ip'), width: 140 },
  {
    field: 'success',
    title: $t('system.column.status'),
    width: 80,
    slots: { default: 'successSlot' },
  },
  { field: 'time', title: $t('system.column.time'), width: 180 },
];

/** 搜索表单定义 */
export const logsSearchSchemas: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'api',
    label: $t('system.logs.filter.api'),
    componentProps: { placeholder: $t('system.logs.placeholder.api') },
  },
  {
    component: 'Input',
    fieldName: 'operator',
    label: $t('system.logs.filter.operator'),
    componentProps: { placeholder: $t('system.logs.placeholder.operator') },
  },
  {
    component: 'Select',
    fieldName: 'method',
    label: $t('system.logs.filter.method'),
    componentProps: {
      placeholder: $t('system.placeholder.select'),
      options: searchMethodOptions,
    },
  },
  {
    component: 'Select',
    fieldName: 'success',
    label: $t('system.logs.filter.status'),
    componentProps: {
      placeholder: $t('system.placeholder.select'),
      options: statusOptions,
    },
  },
];
