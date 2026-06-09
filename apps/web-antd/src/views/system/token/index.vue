<script setup lang="ts">
import { useVbenDrawer } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteTokenApi, getTokenListApi } from '#/api/system/token';
import { $t } from '#/locales';

import TokenDrawer from './token-drawer.vue';
import { tokenColumns, tokenSearchSchemas } from './token.data';

defineOptions({ name: 'TokenManagement' });

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: tokenSearchSchemas,
  },
  gridOptions: {
    columns: tokenColumns,
    proxyConfig: {
      ajax: {
        query: async (params: any, customValues: any) => {
          const f = customValues ?? {};
          const result = await getTokenListApi({
            page: params.page,
            pageSize: params.pageSize,
            username: f.username || '',
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

const [TokenDrawerComp, tokenDrawerApi] = useVbenDrawer({
  connectedComponent: TokenDrawer,
});

function openEdit(record: any) {
  tokenDrawerApi.setData({
    record,
    isEdit: true,
    onSuccess: () => gridApi.query(),
  });
  tokenDrawerApi.open();
}

async function handleDelete(userID: number) {
  try {
    await deleteTokenApi(userID);
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
      <template #actionSlot="{ row }">
        <a-button size="small" type="link" @click="openEdit(row)">
          {{ $t('system.action.edit') }}
        </a-button>
        <a-popconfirm
          :title="$t('system.confirm.deleteToken')"
          @confirm="handleDelete(row.userID)"
        >
          <a-button size="small" type="link" danger>
            {{ $t('system.action.delete') }}
          </a-button>
        </a-popconfirm>
      </template>
    </Grid>

    <TokenDrawerComp />
  </Page>
</template>
