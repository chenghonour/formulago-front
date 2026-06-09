<script setup lang="ts">
import { useVbenDrawer } from '@formulago/common-ui';
import { Plus } from '@formulago/icons';

import { Button, message, Switch } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteRoleApi, getRoleListApi, updateRoleStatusApi } from '#/api';
import { $t } from '#/locales';

import RoleDrawer from './role-drawer.vue';
import { roleColumns, roleSearchSchemas } from './role.data';

defineOptions({ name: 'RoleManagement' });

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: roleSearchSchemas,
  },
  gridOptions: {
    columns: roleColumns,
    proxyConfig: {
      ajax: {
        query: async (params: any, customValues: any) => {
          const f = customValues ?? {};
          const result = await getRoleListApi({
            page: params.page,
            pageSize: params.pageSize,
            name: f.name || '',
            status:
              f.status === '' || f.status === undefined
                ? undefined
                : f.status,
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
  },
});

const [RoleDrawerComp, roleDrawerApi] = useVbenDrawer({
  connectedComponent: RoleDrawer,
});

function openAdd() {
  roleDrawerApi.setData({
    isEdit: false,
    onSuccess: () => gridApi.query(),
  });
  roleDrawerApi.open();
}

function openEdit(record: any) {
  roleDrawerApi.setData({
    record,
    isEdit: true,
    onSuccess: () => gridApi.query(),
  });
  roleDrawerApi.open();
}

async function handleDelete(id: number) {
  try {
    await deleteRoleApi({ ID: id });
    message.success($t('system.message.deleteSuccess'));
    gridApi.query();
  } catch (error) {
    console.error(error);
  }
}

async function handleStatusChange(id: number, status: number) {
  try {
    await updateRoleStatusApi({ ID: id, status });
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
          {{ $t('system.role.addTitle') }}
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
          :title="$t('system.confirm.deleteRole')"
          @confirm="handleDelete(row.ID)"
        >
          <a-button size="small" type="link" danger>
            {{ $t('system.action.delete') }}
          </a-button>
        </a-popconfirm>
      </template>
    </Grid>

    <RoleDrawerComp />
  </Page>
</template>
