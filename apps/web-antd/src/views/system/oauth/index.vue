<script setup lang="ts">
import { useVbenDrawer } from '@formulago/common-ui';
import { Plus } from '@formulago/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteProviderApi, getProviderListApi } from '#/api/system/oauth';
import { $t } from '#/locales';

import OAuthDrawer from './oauth-drawer.vue';
import { oauthColumns } from './oauth.data';

defineOptions({ name: 'OauthManagement' });

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: oauthColumns,
    proxyConfig: {
      ajax: {
        query: async ({ page, pageSize }: { page: number; pageSize: number }) => {
          const result = await getProviderListApi({ page, pageSize });
          return { items: result.data, total: result.total };
        },
      },
    },
    toolbarConfig: {
      refresh: true,
      zoom: true,
    },
    height: 'auto',
    scrollY: {
      enabled: true,
      gt: 0,
    },
  },
});

const [OAuthDrawerComp, oauthDrawerApi] = useVbenDrawer({
  class: 'w-180',
  connectedComponent: OAuthDrawer,
});

function openAddOAuth() {
  oauthDrawerApi.setData({
    isEdit: false,
    onSuccess: () => gridApi.query(),
  });
  oauthDrawerApi.open();
}

function openEdit(record: any) {
  oauthDrawerApi.setData({
    record,
    isEdit: true,
    onSuccess: () => gridApi.query(),
  });
  oauthDrawerApi.open();
}

async function handleDelete(id: number) {
  try {
    await deleteProviderApi({ ID: id });
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
        <Button type="primary" @click="openAddOAuth()">
          <Plus class="size-4" />
          {{ $t('system.oauth.addTitle') }}
        </Button>
      </template>
      <template #actionSlot="{ row }">
        <a-button size="small" type="link" @click="openEdit(row)">
          {{ $t('system.action.edit') }}
        </a-button>
        <a-popconfirm
          :title="$t('system.confirm.deleteOauth')"
          @confirm="handleDelete(row.id)"
        >
          <a-button size="small" type="link" danger>
            {{ $t('system.action.delete') }}
          </a-button>
        </a-popconfirm>
      </template>
    </Grid>

    <OAuthDrawerComp />
  </Page>
</template>
