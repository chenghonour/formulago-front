<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useVbenModal } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import {
  getApiAuthorityApi,
  getRoleListApi,
  updateApiAuthorityApi,
} from '#/api';
import { $t } from '#/locales';

defineOptions({ name: 'SystemAuthorityApi' });

const columns = [
  { title: $t('system.column.path'), dataIndex: 'path' },
  { title: $t('system.column.method'), dataIndex: 'method', width: 120 },
  { title: $t('system.column.action'), dataIndex: 'action', width: 100 },
];

const roleList = ref<any[]>([]);
const selectedRoleID = ref<number>();
const apiAuthorities = ref<any[]>([]);
const loadingRoles = ref(false);
const loadingAuths = ref(false);

async function fetchRoles() {
  loadingRoles.value = true;
  try {
    const result = await getRoleListApi({ page: 1, pageSize: 999 });
    roleList.value = result.data || [];
  } finally {
    loadingRoles.value = false;
  }
}

async function fetchApiAuthorities() {
  if (!selectedRoleID.value) return;
  loadingAuths.value = true;
  try {
    const result = await getApiAuthorityApi(selectedRoleID.value);
    apiAuthorities.value = Array.isArray(result)
      ? result.map((item: any, index: number) => ({ ...item, _key: index }))
      : [];
  } finally {
    loadingAuths.value = false;
  }
}

function handleRoleChange(value: number) {
  selectedRoleID.value = value;
  fetchApiAuthorities();
}

const newAuth = ref({ path: '', method: 'GET' });

const [AuthModal, authModalApi] = useVbenModal({
  onCancel() {
    authModalApi.close();
  },
  async onConfirm() {
    if (!selectedRoleID.value) return;
    try {
      const currentList = [...apiAuthorities.value, { ...newAuth.value }];
      await updateApiAuthorityApi(selectedRoleID.value, currentList);
      message.success($t('system.message.authAdded'));
      newAuth.value = { path: '', method: 'GET' };
      authModalApi.close();
      fetchApiAuthorities();
    } catch (error) {
      console.error(error);
    }
  },
});

function openAddAuth() {
  newAuth.value = { path: '', method: 'GET' };
  authModalApi.open();
}

async function removeAuth(index: number) {
  if (!selectedRoleID.value) return;
  try {
    const currentList = apiAuthorities.value.filter(
      (_: any, i: number) => i !== index,
    );
    await updateApiAuthorityApi(selectedRoleID.value, currentList);
    message.success($t('system.message.deleteSuccess'));
    fetchApiAuthorities();
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  fetchRoles();
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
        <span class="font-medium">{{ $t('system.authority.apiListTitle') }}</span>
        <a-button type="primary" size="small" @click="openAddAuth">
          {{ $t('system.action.addAuth') }}
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="apiAuthorities"
        :loading="loadingAuths"
        row-key="_key"
        size="middle"
      >
        <template #bodyCell="{ column, index }">
          <template v-if="column.dataIndex === 'action'">
            <a-popconfirm :title="$t('system.confirm.deleteAuth')" @confirm="removeAuth(index)">
              <a-button size="small" type="link" danger>{{ $t('system.action.delete') }}</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>

    <AuthModal title="添加API权限">
      <a-form layout="vertical">
        <a-form-item :label="$t('system.column.path')">
          <a-input v-model:value="newAuth.path" placeholder="/api/admin/**" />
        </a-form-item>
        <a-form-item :label="$t('system.column.method')">
          <a-select v-model:value="newAuth.method">
            <a-select-option value="GET">GET</a-select-option>
            <a-select-option value="POST">POST</a-select-option>
            <a-select-option value="PUT">PUT</a-select-option>
            <a-select-option value="DELETE">DELETE</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </AuthModal>
  </div>
</template>
