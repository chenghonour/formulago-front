<script setup lang="ts">
import { nextTick, ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@formulago/common-ui';
import { Plus } from '@formulago/icons';

import { Button, message, Popconfirm } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteDictDetailApi,
  getDictDetailListApi,
} from '#/api/system/dict';
import { $t } from '#/locales';

import DictDetailDrawer from './dict-detail-drawer.vue';
import { dictDetailColumns, dictDetailSearchSchemas } from './dict.data';

const dictName = ref('');
const dictTitle = ref('');
const parentID = ref(0);

// 字典明细 Grid
const [DetailGrid, detailGridApi] = useVbenVxeGrid({
  formOptions: {
    schema: dictDetailSearchSchemas,
  },
  gridOptions: {
    columns: dictDetailColumns,
    proxyConfig: {
      ajax: {
        query: async (_params: any, customValues: any) => {
          if (!dictName.value) return { items: [], total: 0 };
          const f = customValues ?? {};
          const result = await getDictDetailListApi(dictName.value);
          let items = result?.data ?? [];
          // 前端过滤
          if (f.key) {
            items = items.filter((item: any) => item.key?.includes(f.key));
          }
          return { items, total: items.length };
        },
      },
    },
    toolbarConfig: {
      refresh: true,
      zoom: false,
      search: true,
    },
    height: '700px',
    scrollY: {
      enabled: true,
      gt: 0,
    },
  },
});

// 字典项 Drawer
const [DetailDrawerComp, detailDrawerApi] = useVbenDrawer({
  class: 'w-100',
  connectedComponent: DictDetailDrawer,
});

// 字典明细弹窗
const [Modal, modalApi] = useVbenModal({
  class: 'w-250',
  draggable: true,
  footer: false,
  modal: true,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = modalApi.getData<{
        name: string;
        parentID: number;
        title: string;
      }>();
      dictName.value = data.name;
      dictTitle.value = data.title;
      parentID.value = data.parentID;
      // 等 Grid 挂载后查询，此时弹窗动画也在进行中
      nextTick(() => detailGridApi.query());
    }
  },
});

function openAddDetail() {
  detailDrawerApi.setData({
    parentID: parentID.value,
    isEdit: false,
    onSuccess: () => detailGridApi.query(),
  });
  detailDrawerApi.open();
}

function openEditDetail(record: any) {
  detailDrawerApi.setData({
    record,
    isEdit: true,
    onSuccess: () => detailGridApi.query(),
  });
  detailDrawerApi.open();
}

async function handleDeleteDetail(id: number) {
  try {
    await deleteDictDetailApi({ ID: id });
    message.success($t('system.message.deleteSuccess'));
    detailGridApi.query();
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <Modal :title="`${dictTitle } - ${ $t('system.action.detail')}`">
    <DetailGrid>
      <template #toolbar-tools>
        <Button type="primary" size="small" @click="openAddDetail">
          <Plus class="size-4" />
          {{ $t('system.dict.detailTitle') }}
        </Button>
      </template>
      <template #detailActionSlot="{ row }">
        <a-button size="small" type="link" @click="openEditDetail(row)">
          {{ $t('system.action.edit') }}
        </a-button>
        <Popconfirm
          :title="$t('system.confirm.deleteDictDetail')"
          @confirm="handleDeleteDetail(row.ID)"
        >
          <a-button size="small" type="link" danger>
            {{ $t('system.action.delete') }}
          </a-button>
        </Popconfirm>
      </template>
    </DetailGrid>
    <DetailDrawerComp />
  </Modal>
</template>
