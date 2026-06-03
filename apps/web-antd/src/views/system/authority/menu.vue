<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { message } from 'ant-design-vue';

import { getMenuAuthorityApi, getRoleListApi, updateMenuAuthorityApi } from '#/api';
import { getMenuListApi } from '#/api/core/menu-admin';
import { $t } from '#/locales';

defineOptions({ name: 'SystemAuthorityMenu' });

const roleList = ref<any[]>([]);
const menuList = ref<any[]>([]);
const selectedRoleID = ref<number>();
const checkedMenuIDs = ref<number[]>([]);
const loadingRoles = ref(false);
const loadingMenus = ref(false);

async function fetchRoles() {
  loadingRoles.value = true;
  try {
    const result = await getRoleListApi({ page: 1, pageSize: 999 });
    roleList.value = result.data || [];
  } finally {
    loadingRoles.value = false;
  }
}

async function fetchMenus() {
  loadingMenus.value = true;
  try {
    const result = await getMenuListApi({ page: 1, pageSize: 999 });
    menuList.value = result.data || [];
  } finally {
    loadingMenus.value = false;
  }
}

async function fetchMenuAuthorities() {
  if (!selectedRoleID.value) return;
  loadingMenus.value = true;
  try {
    const result = await getMenuAuthorityApi(selectedRoleID.value);
    checkedMenuIDs.value = result?.menuIDs || [];
  } finally {
    loadingMenus.value = false;
  }
}

function handleRoleChange(value: number) {
  selectedRoleID.value = value;
  fetchMenuAuthorities();
}

async function handleSave() {
  if (!selectedRoleID.value) return;
  try {
    await updateMenuAuthorityApi(selectedRoleID.value, checkedMenuIDs.value);
    message.success($t('system.message.menuAuthUpdated'));
  } catch (error) {
    console.error(error);
  }
}

// 收集所有可勾选的菜单 ID
function getAllMenuIds(menus: any[]): number[] {
  const ids: number[] = [];
  for (const menu of menus) {
    ids.push(menu.ID);
    if (menu.children && menu.children.length > 0) {
      ids.push(...getAllMenuIds(menu.children));
    }
  }
  return ids;
}

function onCheck(checkedKeys: any) {
  checkedMenuIDs.value = checkedKeys as number[];
}

onMounted(() => {
  fetchRoles();
  fetchMenus();
});
</script>

<template>
  <div class="p-4">
    <div class="mb-4 rounded bg-white p-4">
      <span class="mr-2 font-medium">{{ $t('system.authority.selectRole') }}</span>
      <a-select
        v-model:value="selectedRoleID"
        class="w-48"
        :placeholder="$t('system.authority.placeholderRole')"
        @change="handleRoleChange"
      >
        <a-select-option
          v-for="role in roleList"
          :key="role.ID"
          :value="role.ID"
        >
          {{ role.name }}
        </a-select-option>
      </a-select>
    </div>

    <div v-if="selectedRoleID" class="rounded bg-white p-4">
      <div class="mb-4 flex items-center justify-between">
        <span class="font-medium">{{ $t('system.authority.menuListTitle') }}</span>
        <a-button type="primary" size="small" @click="handleSave">
          {{ $t('system.action.save') }}
        </a-button>
      </div>

      <a-tree
        checkable
        :check-strictly="false"
        :default-expanded-keys="getAllMenuIds(menuList)"
        :tree-data="menuList"
        :checked-keys="checkedMenuIDs"
        :field-names="{ children: 'children', key: 'ID', title: 'name' }"
        @check="onCheck"
      />
    </div>
  </div>
</template>
