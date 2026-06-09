import type { VbenFormSchema } from '#/adapter/form';
import type { MenuInfo, MenuMeta } from '#/api/system/model/menuModel';

import { $t } from '#/locales';

export const menuTypeOptions = [
  { label: $t('system.menu.form.directory'), value: 0 },
  { label: $t('system.menu.form.menu'), value: 1 },
  { label: $t('system.menu.form.button'), value: 2 },
];

export function getMenuTypeText(menuType: number): string {
  const map: Record<number, string> = {
    0: $t('system.menu.form.directory'),
    1: $t('system.menu.form.menu'),
    2: $t('system.menu.form.button'),
  };
  return map[menuType] || $t('system.menu.form.unknown');
}

export function flattenTree(items: any[]): any[] {
  const result: any[] = [];
  const walk = (list: any[]) => {
    for (const item of list) {
      const { children, ...rest } = item;
      result.push(rest);
      if (children?.length) walk(children);
    }
  };
  walk(items);
  return result;
}

export function createDefaultForm(): Partial<MenuInfo> {
  return {
    ID: undefined,
    parentID: 0,
    name: '',
    path: '',
    component: '',
    redirect: '',
    orderNo: 0,
    menuType: 0,
    disabled: false,
    meta: {
      title: '',
      icon: '',
      hideMenu: false,
      hideBreadcrumb: false,
      ignoreKeepAlive: false,
      affix: false,
      frameSrc: '',
      hideChildrenInMenu: false,
    } as Partial<MenuMeta>,
  };
}

/** 表格列定义 — 含 nameSlot/titleSlot/actionSlot 的字段需在模板中对应同名 slot */
export const menuColumns = [
  { field: 'ID', title: 'ID', width: 80 },
  {
    field: 'name',
    title: $t('system.column.name'),
    width: 200,
    treeNode: true,
    slots: { default: 'nameSlot' },
  },
  {
    field: 'title',
    title: $t('system.column.title'),
    width: 150,
    slots: { default: 'titleSlot' },
  },
  { field: 'path', title: $t('system.column.path'), minWidth: 160 },
  {
    field: 'component',
    title: $t('system.column.component'),
    minWidth: 160,
  },
  { field: 'orderNo', title: $t('system.column.order'), width: 80 },
  {
    field: 'disabled',
    title: $t('system.column.status'),
    width: 100,
    slots: { default: 'disabledSlot' },
  },
  {
    field: 'menuType',
    title: $t('system.column.type'),
    width: 100,
    formatter: ({ cellValue }: { cellValue: number }) =>
      getMenuTypeText(cellValue),
  },
  {
    field: 'action',
    title: $t('system.column.action'),
    width: 250,
    slots: { default: 'actionSlot' },
  },
];

export const menuSearchSchemas: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: $t('system.column.name'),
    componentProps: { placeholder: $t('system.menu.placeholder.name') },
  },
  {
    component: 'Input',
    fieldName: 'title',
    label: $t('system.column.title'),
    componentProps: { placeholder: $t('system.menu.placeholder.title') },
  },
];

export const menuFormSchemas: VbenFormSchema[] = [
   {
    fieldName: 'menuType',
    component: 'Select',
    label: $t('system.menu.form.menuType'),
    componentProps: {
      options: menuTypeOptions,
    },
    formItemClass: 'col-span-3',
    rules: 'required',
  },
  {
    fieldName: 'name',
    component: 'Input',
    label: $t('system.menu.form.name'),
    formItemClass: 'col-span-3',
    rules: 'required',
  },
  {
    fieldName: 'meta.title',
    component: 'Input',
    label: $t('system.menu.form.title'),
    formItemClass: 'col-span-3',
    rules: 'required',
  },
  {
    fieldName: 'meta.icon',
    component: 'IconPicker',
    label: $t('system.menu.form.icon'),
    formItemClass: 'col-span-3',
    rules: 'required',
  },
  {
    fieldName: 'path',
    component: 'Input',
    label: $t('system.menu.form.path'),
    formItemClass: 'col-span-6',
  },
  {
    fieldName: 'component',
    component: 'Input',
    label: $t('system.menu.form.component'),
    formItemClass: 'col-span-6',
    rules: 'required',
  },
  {
    fieldName: 'parentID',
    component: 'TreeSelect',
    label: $t('system.menu.form.parentID'),
    formItemClass: 'col-span-3',
    rules: 'required',
    componentProps: {
      fieldNames: { label: 'name', value: 'ID', children: 'children' },
      getPopupContainer: () => document.body,
      style: { width: '100%' },
    },
  },
  {
    fieldName: 'orderNo',
    component: 'InputNumber',
    label: $t('system.menu.form.order'),
    formItemClass: 'col-span-3',
    rules: 'required',
  },
  {
    fieldName: 'redirect',
    component: 'Input',
    label: $t('system.menu.form.redirect'),
    formItemClass: 'col-span-3',
  },
  {
    fieldName: 'meta.frameSrc',
    component: 'Input',
    label: $t('system.menu.form.frameSrc'),
    formItemClass: 'col-span-3',
  },
  {
    fieldName: 'meta.hideMenu',
    component: 'Switch',
    label: $t('system.menu.form.hideMenu'),
    formItemClass: 'col-span-2',
  },
  {
    fieldName: 'meta.hideBreadcrumb',
    component: 'Switch',
    label: $t('system.menu.form.hideBreadcrumb'),
    formItemClass: 'col-span-2',
  },
  {
    fieldName: 'meta.ignoreKeepAlive',
    component: 'Switch',
    label: $t('system.menu.form.ignoreKeepAlive'),
    formItemClass: 'col-span-2',
  },
  {
    fieldName: 'meta.affix',
    component: 'Switch',
    label: $t('system.menu.form.affixTab'),
    formItemClass: 'col-span-2',
  },
  {
    fieldName: 'meta.hideChildrenInMenu',
    component: 'Switch',
    label: $t('system.menu.form.hideChildrenInMenu'),
    formItemClass: 'col-span-2',
  },
  {
    fieldName: 'disabled',
    component: 'Switch',
    label: $t('system.menu.form.disabled'),
    formItemClass: 'col-span-2',
  },
];
