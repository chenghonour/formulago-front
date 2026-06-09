import type { VbenFormSchema } from '#/adapter/form';
import type { RoleInfo } from '#/api/system/model/roleModel';

import { $t } from '#/locales';

export function createDefaultForm(): Partial<RoleInfo> {
  return {
    ID: undefined,
    name: '',
    value: '',
    defaultRouter: '',
    status: 1,
    remark: '',
    orderNo: 0,
  };
}

/** Convert flat API list to tree data grouped by `group` */
export function convertApiTreeData(apis: any[]): any[] {
  const groupMap = new Map<string, any[]>();
  for (const api of apis) {
    const group = api.group || 'Other';
    if (!groupMap.has(group)) groupMap.set(group, []);
    groupMap.get(group)?.push(api);
  }
  return [...groupMap.entries()]
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([group, items]) => ({
      ID: group,
      name: group,
      children: items
        .toSorted((a, b) => a.ID - b.ID)
        .map((api) => ({
          ID: api.ID,
          name: api.description || api.path,
        })),
    }));
}

/** Convert role's API authorities (path+method) to checked tree keys */
export function convertApiToCheckedKeys(
  checkedAuths: any[],
  allApis: any[],
): any[] {
  const dataMap = new Map<string, number>();
  for (const api of allApis) {
    dataMap.set(api.path + api.method, api.ID);
  }
  return checkedAuths
    .map((auth) => dataMap.get(auth.path + auth.method))
    .filter((id) => id !== null);
}

/** Convert checked tree keys to API authority request format */
export function convertApiCheckedKeysToReq(
  checkedKeys: any[],
  allApis: any[],
): any[] {
  const apiIds = new Set(
    checkedKeys.filter((k: any) => typeof k === 'number'),
  );
  return allApis
    .filter((api) => apiIds.has(api.ID))
    .map((api) => ({ path: api.path, method: api.method }));
}

/** Collect all menu IDs from nested tree */
export function getAllMenuIds(menus: any[]): number[] {
  const ids: number[] = [];
  for (const menu of menus) {
    ids.push(menu.ID);
    if (menu.children && menu.children.length > 0) {
      ids.push(...getAllMenuIds(menu.children));
    }
  }
  return ids;
}

/** Table columns */
export const roleColumns = [
  { field: 'ID', title: 'ID', width: 80 },
  { field: 'name', title: $t('system.column.name'), width: 150 },
  { field: 'value', title: $t('system.column.key'), width: 150 },
  {
    field: 'defaultRouter',
    title: $t('system.column.defaultRouter'),
    width: 200,
  },
  { field: 'orderNo', title: $t('system.column.order'), width: 80 },
  { field: 'remark', title: $t('system.column.remark') },
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

/** Search form schemas */
export const roleSearchSchemas: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: $t('system.column.name'),
    componentProps: {
      placeholder: $t('system.role.placeholder.name'),
    },
  },
  {
    component: 'Select',
    fieldName: 'status',
    label: $t('system.column.status'),
    componentProps: {
      placeholder: $t('system.placeholder.select'),
      options: [
        { label: $t('system.httpMethod.all'), value: '' },
        { label: $t('system.status.enabled'), value: '1' },
        { label: $t('system.status.disabled'), value: '0' },
      ],
    },
  },
];

/** Drawer form schemas (basic info tab) */
export const roleFormSchemas: VbenFormSchema[] = [
  {
    fieldName: 'name',
    component: 'Input',
    label: $t('system.column.name'),
    formItemClass: 'col-span-3',
    rules: 'required',
  },
  {
    fieldName: 'value',
    component: 'Input',
    label: $t('system.column.key'),
    formItemClass: 'col-span-3',
    rules: 'required',
  },
  {
    fieldName: 'defaultRouter',
    component: 'Input',
    label: $t('system.column.defaultRouter'),
    formItemClass: 'col-span-3',
    rules: 'required',
  },
  {
    fieldName: 'orderNo',
    component: 'InputNumber',
    label: $t('system.column.order'),
    formItemClass: 'col-span-2',
    rules: 'required',
  },
  {
    fieldName: 'remark',
    component: 'Input',
    label: $t('system.column.remark'),
    formItemClass: 'col-span-3',
  },
  {
    fieldName: 'status',
    component: 'Switch',
    label: $t('system.column.status'),
    formItemClass: 'col-span-2',
  },
];
