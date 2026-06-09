<script setup lang="ts">
import { useVbenDrawer } from '@formulago/common-ui';
import { Plus } from '@formulago/icons';

import { Button, message, Switch } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteUserApi,
  getUserListApi,
  updateUserStatusApi,
} from '#/api/system/user';
import { $t } from '#/locales';

import UserDrawer from './user-drawer.vue';
import { userColumns, userSearchSchemas } from './user.data';

defineOptions({ name: 'UserManagement' });

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: userSearchSchemas,
  },
  gridOptions: {
    columns: userColumns,
    proxyConfig: {
      ajax: {
        query: async (params: any, customValues: any) => {
          const filters = customValues ?? {};
          const result = await getUserListApi({
            page: params.page,
            pageSize: params.pageSize,
            username: filters.username || '',
            nickname: filters.nickname || '',
            email: filters.email || '',
            mobile: filters.mobile || '',
          });
          return { items: result.data, total: result.total };
        },
      },
    },
    toolbarConfig: {
      refresh: true,
      zoom: true,
      search: true,
    },
    height: 'auto',
    scrollY: {
      enabled: true,
      gt: 0,
    },
  },
});

const [UserDrawerComp, userDrawerApi] = useVbenDrawer({
  connectedComponent: UserDrawer,
});

function openAdd() {
  userDrawerApi.setData({
    isEdit: false,
    onSuccess: () => gridApi.query(),
  });
  userDrawerApi.open();
}

function openEdit(record: any) {
  userDrawerApi.setData({
    record,
    isEdit: true,
    onSuccess: () => gridApi.query(),
  });
  userDrawerApi.open();
}

async function handleDelete(id: number) {
  try {
    await deleteUserApi({ ID: id });
    message.success($t('system.message.deleteSuccess'));
    gridApi.query();
  } catch (error) {
    console.error(error);
  }
}

async function handleStatusChange(id: number, status: number) {
  try {
    await updateUserStatusApi({ ID: id, status });
    message.success($t('system.message.updateSuccess'));
    gridApi.query();
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Button type="primary" @click="openAdd()">
          <Plus class="size-4" />
          {{ $t('system.user.addTitle') }}
        </Button>
      </template>
      <template #statusSlot="{ row }">
        <Switch
          :checked="row.status === 1"
          size="small"
          @change="handleStatusChange(row.ID, row.status === 1 ? 0 : 1)"
        />
      </template>
      <template #actionSlot="{ row }">
        <a-button size="small" type="link" @click="openEdit(row)">
          {{ $t('system.action.edit') }}
        </a-button>
        <a-popconfirm
          :title="$t('system.confirm.deleteUser')"
          @confirm="handleDelete(row.ID)"
        >
          <a-button size="small" type="link" danger>
            {{ $t('system.action.delete') }}
          </a-button>
        </a-popconfirm>
      </template>
    </Grid>

    <UserDrawerComp />
  </Page>
</template>
