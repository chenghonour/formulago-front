<script setup lang="ts">
import type { MenuInfo } from '#/api/system/model/menuModel';

import { ref } from 'vue';

import { useVbenDrawer } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createMenuApi,
  getMenuListApi,
  updateMenuApi,
} from '#/api/system/menu';
import { $t } from '#/locales';

import { createDefaultForm, menuFormSchemas } from './menu.data';

const drawerTitle = ref('');

const [Form, formApi] = useVbenForm({
  schema: menuFormSchemas,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-6',
});

const [Drawer, drawerApi] = useVbenDrawer({
  onOpened() {
    const data = drawerApi.getData<{
      isEdit: boolean;
      parentID?: number;
      record?: Partial<MenuInfo>;
    }>();
    const defaultValues = createDefaultForm();
    drawerTitle.value = data.isEdit
      ? $t('system.menu.editTitle')
      : (data.parentID
        ? $t('system.menu.addChildTitle')
        : $t('system.menu.addTitle'));
    if (data.isEdit && data.record) {
      formApi.setValues({ ...defaultValues, ...data.record });
    } else {
      formApi.setValues({
        ...defaultValues,
        parentID: data.parentID ?? 0,
      });
    }
    // 加载菜单树供父级选择
    loadMenuTree();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = (await formApi.getValues()) as Partial<MenuInfo>;
    const data = drawerApi.getData<{
      isEdit: boolean;
      onSuccess: () => void;
      record?: Partial<MenuInfo>;
    }>();

    drawerApi.lock(true);
    try {
      if (data.isEdit && data.record?.ID) {
        await updateMenuApi({ ...values, ID: data.record.ID });
        message.success($t('system.message.updateSuccess'));
      } else {
        await createMenuApi(values);
        message.success($t('system.message.createSuccess'));
      }
      data.onSuccess?.();
      drawerApi.close();
    } catch (error) {
      console.error(error);
    } finally {
      drawerApi.lock(false);
    }
  },
});

/** 加载菜单树供 TreeSelect 使用 */
async function loadMenuTree() {
  try {
    const result = await getMenuListApi({ page: 1, pageSize: 999 });
    const tree = result.data ?? [];
    tree.push({
      ID: 1,
      name: 'root',
      menuType: 0,
      parentID: 1,
      path: '',
      redirect: '',
      component: '',
      orderNo: 0,
      disabled: false,
      meta: {
        title: $t('system.menu.rootMenu'),
        icon: '',
        hideMenu: false,
        hideBreadcrumb: false,
        currentActiveMenu: '',
        ignoreKeepAlive: false,
        hideTab: false,
        frameSrc: '',
        carryParam: false,
        hideChildrenInMenu: false,
        affix: false,
        dynamicLevel: 0,
        realPath: '',
      },
      children: [],
    });
    formApi.updateSchema([
      {
        fieldName: 'parentID',
        componentProps: { treeData: tree },
      },
    ]);
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <Drawer :title="drawerTitle">
    <Form />
  </Drawer>
</template>
