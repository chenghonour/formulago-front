<script setup lang="ts">
import type { RoleInfo } from '#/api/system/model/roleModel';

import { ref } from 'vue';

import { useVbenDrawer } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createRoleApi,
  getApiAuthorityApi,
  getApiListApi,
  getMenuAuthorityApi,
  updateApiAuthorityApi,
  updateMenuAuthorityApi,
  updateRoleApi,
} from '#/api';
import { getMenuListApi } from '#/api/system/menu';
import { $t } from '#/locales';

import {
  convertApiCheckedKeysToReq,
  convertApiToCheckedKeys,
  convertApiTreeData,
  createDefaultForm,
  getAllMenuIds,
  roleFormSchemas,
} from './role.data';

const drawerTitle = ref('');
const isEdit = ref(false);
const activeTab = ref('basic');

// Menu authority state
const menuList = ref<any[]>([]);
const checkedMenuIDs = ref<number[]>([]);
const loadingMenu = ref(false);

// API authority state
const treeApiData = ref<any[]>([]);
const checkedApiKeys = ref<any[]>([]);
const allApiData = ref<any[]>([]);
const loadingApi = ref(false);

let onSuccessCallback: (() => void) | undefined;

const [Form, formApi] = useVbenForm({
  schema: roleFormSchemas,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-3',
});

const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-100',
  onOpened() {
    const data = drawerApi.getData<{
      isEdit?: boolean;
      onSuccess?: () => void;
      record?: RoleInfo;
    }>();
    isEdit.value = data.isEdit ?? false;
    onSuccessCallback = data.onSuccess;
    activeTab.value = 'basic';

    const defaultValues = createDefaultForm();
    drawerTitle.value = data.isEdit
      ? $t('system.role.editTitle')
      : $t('system.role.addTitle');

    if (data.isEdit && data.record) {
      const recordFormatted = {
        ...data.record,
        status: data.record.status === 1,
      };
      formApi.setValues({ ...defaultValues, ...recordFormatted });
      loadAuthorityData(data.record.ID);
    } else {
      formApi.setValues({ ...defaultValues, status: true });
      menuList.value = [];
      checkedMenuIDs.value = [];
      treeApiData.value = [];
      checkedApiKeys.value = [];
      allApiData.value = [];
    }
  },
  onClosed() {
    onSuccessCallback?.();
  },
  async onConfirm() {
    const data = drawerApi.getData<{
      isEdit?: boolean;
      record?: Partial<RoleInfo>;
    }>();

    drawerApi.lock(true);
    try {
      switch (activeTab.value) {
      case 'api': {
        if (!data.isEdit || !data.record?.ID) return;
        const apiReqData = convertApiCheckedKeysToReq(
          checkedApiKeys.value,
          allApiData.value,
        );
        await updateApiAuthorityApi({
          roleID: data.record.ID,
          data: apiReqData,
        });
        message.success($t('system.message.updateSuccess'));
      
      break;
      }
      case 'basic': {
        const { valid } = await formApi.validate();
        if (!valid) return;

        const values = (await formApi.getValues()) as any;
        const roleData: any = {
          ...values,
          status: values.status ? 1 : 0,
        };

        if (data.isEdit && data.record?.ID) {
          await updateRoleApi({ ...roleData, ID: data.record.ID });
          message.success($t('system.message.updateSuccess'));
        } else {
          await createRoleApi(roleData);
          message.success($t('system.message.createSuccess'));
          drawerApi.close();
          return;
        }
      
      break;
      }
      case 'menu': {
        if (!data.isEdit || !data.record?.ID) return;
        await updateMenuAuthorityApi({
          roleID: data.record.ID,
          MenuIDs: checkedMenuIDs.value,
        });
        message.success($t('system.message.updateSuccess'));
      
      break;
      }
      // No default
      }
    } catch (error) {
      console.error(error);
    } finally {
      drawerApi.lock(false);
    }
  },
});

async function loadAuthorityData(roleID: number) {
  loadingMenu.value = true;
  try {
    const menuResult = await getMenuListApi({ page: 1, pageSize: 999 });
    menuList.value = menuResult.data || [];

    const menuAuthResult = await getMenuAuthorityApi({ ID: roleID });
    checkedMenuIDs.value = menuAuthResult?.MenuIDs || [];
  } finally {
    loadingMenu.value = false;
  }

  loadingApi.value = true;
  try {
    const [apiResult, authResult] = await Promise.all([
      getApiListApi({ page: 1, pageSize: 9999 }),
      getApiAuthorityApi({ ID: roleID }),
    ]);
    allApiData.value = apiResult?.data || [];
    treeApiData.value = convertApiTreeData(allApiData.value);
    const checkedAuths = authResult?.data ?? [];
    checkedApiKeys.value = convertApiToCheckedKeys(
      checkedAuths,
      allApiData.value,
    );
  } finally {
    loadingApi.value = false;
  }
}

function onMenuCheck(checkedKeys: any) {
  checkedMenuIDs.value = checkedKeys as number[];
}

function onApiCheck(checkedKeys: any) {
  checkedApiKeys.value = checkedKeys as any[];
}
</script>

<template>
  <Drawer :title="drawerTitle">
    <a-tabs v-model:active-key="activeTab" type="card">
      <a-tab-pane key="basic" :tab="$t('system.column.basicInfo')">
        <Form />
      </a-tab-pane>
      <a-tab-pane
        key="menu"
        :tab="$t('system.role.authMenu')"
        :disabled="!isEdit"
      >
        <div class="py-2">
          <div class="mb-3 font-medium">
            {{ $t('system.authority.menuListTitle') }}
          </div>
          <a-tree
            checkable
            :check-strictly="false"
            :default-expanded-keys="getAllMenuIds(menuList)"
            :tree-data="menuList"
            :checked-keys="checkedMenuIDs"
            :field-names="{ children: 'children', key: 'ID', title: 'name' }"
            :loading="loadingMenu"
            @check="onMenuCheck"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane
        key="api"
        :tab="$t('system.role.authApi')"
        :disabled="!isEdit"
      >
        <div class="py-2">
          <div class="mb-3 font-medium">
            {{ $t('system.authority.apiListTitle') }}
          </div>
          <a-tree
            checkable
            :check-strictly="false"
            :default-expand-all="false"
            :tree-data="treeApiData"
            :checked-keys="checkedApiKeys"
            :field-names="{ children: 'children', key: 'ID', title: 'name' }"
            :loading="loadingApi"
            @check="onApiCheck"
          />
        </div>
      </a-tab-pane>
    </a-tabs>
  </Drawer>
</template>
