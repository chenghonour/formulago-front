import type { VbenFormSchema } from '#/adapter/form';
import type {
  CreateOrUpdateDictDetailReq,
  CreateOrUpdateDictReq,
} from '#/api/system/model/dictModel';

import { $t } from '#/locales';

/** 创建默认字典表单值 */
export function createDefaultDictForm(): Partial<CreateOrUpdateDictReq> {
  return {
    ID: undefined,
    title: '',
    name: '',
    status: 1,
    description: '',
  };
}

/** 创建默认字典项表单值 */
export function createDefaultDetailForm(): Partial<CreateOrUpdateDictDetailReq> {
  return {
    ID: undefined,
    title: '',
    key: '',
    value: '',
    status: 1,
    parentID: undefined,
  };
}

/** 主表（字典）列定义 */
export const dictColumns = [
  { field: 'ID', title: 'ID', width: 80 },
  { field: 'title', title: $t('system.column.title'), width: 120 },
  { field: 'name', title: $t('system.column.key'), width: 150 },
  { field: 'description', title: $t('system.column.description') },
  {
    field: 'status',
    title: $t('system.column.status'),
    width: 100,
    slots: { default: 'statusSlot' },
  },
  {
    field: 'action',
    title: $t('system.column.action'),
    width: 250,
    slots: { default: 'actionSlot' },
  },
];

/** 字典明细列定义 */
export const dictDetailColumns = [
  { field: 'ID', title: 'ID', width: 80 },
  { field: 'title', title: $t('system.column.title'), width: 120 },
  { field: 'key', title: $t('system.column.key'), width: 120 },
  { field: 'value', title: $t('system.column.value') },
  {
    field: 'status',
    title: $t('system.column.status'),
    width: 80,
    formatter: ({ cellValue }: any) =>
      cellValue === 1 ? $t('system.status.enabled') : $t('system.status.disabled'),
  },
  {
    field: 'action',
    title: $t('system.column.action'),
    width: 180,
    slots: { default: 'detailActionSlot' },
  },
];

/** 字典明细搜索表单定义 */
export const dictDetailSearchSchemas: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'key',
    label: $t('system.column.key'),
    componentProps: { placeholder: $t('system.dict.placeholder.key') },
  },
];

/** 搜索表单定义 */
export const dictSearchSchemas: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'title',
    label: $t('system.dict.filter.title'),
    componentProps: { placeholder: $t('system.dict.placeholder.title') },
  },
  {
    component: 'Input',
    fieldName: 'name',
    label: $t('system.dict.filter.name'),
    componentProps: { placeholder: $t('system.dict.placeholder.name') },
  },
];

/** 字典抽屉表单定义 */
export const dictFormSchemas: VbenFormSchema[] = [
  {
    fieldName: 'title',
    component: 'Input',
    label: $t('system.column.title'),
    formItemClass: 'col-span-full',
    componentProps: { placeholder: $t('system.dict.placeholder.title') },
    rules: 'required',
  },
  {
    fieldName: 'name',
    component: 'Input',
    label: $t('system.column.key'),
    formItemClass: 'col-span-full',
    componentProps: { placeholder: $t('system.dict.placeholder.name') },
    rules: 'required',
  },
  {
    fieldName: 'description',
    component: 'Input',
    label: $t('system.column.description'),
    formItemClass: 'col-span-full',
    rules: 'required',
  },
  {
    fieldName: 'status',
    component: 'Switch',
    label: $t('system.column.status'),
    formItemClass: 'col-span-full',
    rules: 'required',
  },
];

/** 字典项抽屉表单定义 */
export const dictDetailFormSchemas: VbenFormSchema[] = [
  {
    fieldName: 'title',
    component: 'Input',
    label: $t('system.column.title'),
    formItemClass: 'col-span-full',
    rules: 'required',
  },
  {
    fieldName: 'key',
    component: 'Input',
    label: $t('system.column.key'),
    formItemClass: 'col-span-full',
    rules: 'required',
  },
  {
    fieldName: 'value',
    component: 'Input',
    label: $t('system.column.value'),
    formItemClass: 'col-span-full',
    rules: 'required',
  },
  {
    fieldName: 'status',
    component: 'Switch',
    label: $t('system.column.status'),
    formItemClass: 'col-span-full',
  },
];
