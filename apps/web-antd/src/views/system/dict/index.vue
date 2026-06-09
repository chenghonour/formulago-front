<script setup lang="ts">
import { useVbenDrawer, useVbenModal } from '@formulago/common-ui';
import { Plus } from '@formulago/icons';

import { Button, message, Switch } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDictApi, getDictListApi } from '#/api/system/dict';
import { $t } from '#/locales';

import DictDetailModal from './dict-detail-modal.vue';
import DictDrawer from './dict-drawer.vue';
import { dictColumns, dictSearchSchemas } from './dict.data';

defineOptions({ name: 'DictionaryManagement' });

/** 查看字典明细弹窗 */
async function showDetails(record: any) {
  detailModalApi.setData({
    name: record.name,
    title: record.title,
    parentID: record.ID,
  });
  detailModalApi.open();
}

// ===== 主字典 Grid =====
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: dictSearchSchemas,
  },
  gridOptions: {
    columns: dictColumns,
    proxyConfig: {
      ajax: {
        query: async (params: any, customValues: any) => {
          const f = customValues ?? {};
          const result = await getDictListApi({
            page: params.page,
            pageSize: params.pageSize,
            title: f.title || '',
            name: f.name || '',
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

// ===== 字典 Drawer =====
const [DictDrawerComp, dictDrawerApi] = useVbenDrawer({
  class: 'w-100',
  connectedComponent: DictDrawer,
});

// ===== 字典明细弹窗 =====
const [DetailModalComp, detailModalApi] = useVbenModal({
  connectedComponent: DictDetailModal,
});

function openAddDict() {
  dictDrawerApi.setData({
    isEdit: false,
    onSuccess: () => gridApi.query(),
  });
  dictDrawerApi.open();
}

function openEditDict(record: any) {
  dictDrawerApi.setData({
    record,
    isEdit: true,
    onSuccess: () => gridApi.query(),
  });
  dictDrawerApi.open();
}

async function handleDeleteDict(id: number) {
  try {
    await deleteDictApi(id);
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
        <Button type="primary" @click="openAddDict()">
          <Plus class="size-4" />
          {{ $t('system.dict.addTitle') }}
        </Button>
      </template>
      <template #statusSlot="{ row }">
        <Switch :checked="row.status === 1" size="small" disabled />
      </template>
      <template #actionSlot="{ row }">
        <a-button size="small" type="link" @click="showDetails(row)">
          {{ $t('system.action.detail') }}
        </a-button>
        <a-button size="small" type="link" @click="openEditDict(row)">
          {{ $t('system.action.edit') }}
        </a-button>
        <a-popconfirm
          :title="$t('system.confirm.deleteDict')"
          @confirm="handleDeleteDict(row.ID)"
        >
          <a-button size="small" type="link" danger>
            {{ $t('system.action.delete') }}
          </a-button>
        </a-popconfirm>
      </template>
    </Grid>

    <DictDrawerComp />
    <DetailModalComp />
  </Page>
</template>
