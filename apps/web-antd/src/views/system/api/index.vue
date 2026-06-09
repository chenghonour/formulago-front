<script setup lang="ts">
import { useVbenDrawer } from '@formulago/common-ui';
import { Plus } from '@formulago/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteApiApi, getApiListApi } from '#/api/system/apis';
import { $t } from '#/locales';

import ApiDrawer from './api-drawer.vue';
import { apiColumns, apiSearchSchemas } from './api.data';

defineOptions({ name: 'APIManagement' });

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: apiSearchSchemas,
  },
  gridOptions: {
    columns: apiColumns,
    proxyConfig: {
      ajax: {
        query: async (params: any, customValues: any) => {
          const f = customValues ?? {};
          const result = await getApiListApi({
            page: params.page,
            pageSize: params.pageSize,
            path: f.path || '',
            description: f.description || '',
            group: f.group || '',
            method: f.method || '',
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

const [ApiDrawerComp, apiDrawerApi] = useVbenDrawer({
  connectedComponent: ApiDrawer,
});

function openAdd() {
  apiDrawerApi.setData({
    isEdit: false,
    onSuccess: () => gridApi.query(),
  });
  apiDrawerApi.open();
}

function openEdit(record: any) {
  apiDrawerApi.setData({
    record,
    isEdit: true,
    onSuccess: () => gridApi.query(),
  });
  apiDrawerApi.open();
}

async function handleDelete(id: number) {
  try {
    await deleteApiApi(id);
    message.success($t('system.message.deleteSuccess'));
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
          {{ $t('system.api.addTitle') }}
        </Button>
      </template>
      <template #actionSlot="{ row }">
        <a-button size="small" type="link" @click="openEdit(row)">
          {{ $t('system.action.edit') }}
        </a-button>
        <a-popconfirm
          :title="$t('system.confirm.deleteApi')"
          @confirm="handleDelete(row.ID)"
        >
          <a-button size="small" type="link" danger>
            {{ $t('system.action.delete') }}
          </a-button>
        </a-popconfirm>
      </template>
    </Grid>

    <ApiDrawerComp />
  </Page>
</template>
