<script setup lang="ts">
import { useVbenDrawer } from '@formulago/common-ui';
import { IconifyIcon, Plus } from '@formulago/icons';

import { Button, message, Switch } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteMenuApi, getMenuListApi } from '#/api/system/menu';
import { $t } from '#/locales';

import MenuDrawer from './menu-drawer.vue';
import { flattenTree, menuColumns, menuSearchSchemas } from './menu.data';

defineOptions({ name: 'MenuManagement' });

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: $t('system.menu.title'),
  // 配置与表格关联的查询表单选项
  formOptions: {
     // 传入查询表单的结构定义
    schema: menuSearchSchemas,
  },
  // 表格本身的配置选项
  gridOptions: {
    columns: menuColumns,
    // 代理配置：用于处理数据请求，将表格与后端 API 绑定
    proxyConfig: {
      ajax: {
        // 数据查询方法：当触发查询时自动调用
        // params 包含分页信息，customValues 包含表单的查询条件
        query: async (params: any, customValues: any) => {
          const f = customValues ?? {};
          const result = await getMenuListApi({
            page: params.page,
            pageSize: params.pageSize,
            name: f.name || '',
            title: f.title || '',
          });
          // 返回处理后的数据：
          // 1. 使用 flattenTree 将树形数据扁平化（适配 VxeTable 的树形展示）
          // 2. 返回总条数用于分页或虚拟滚动计算
          return { items: flattenTree(result.data || []), total: result.total };
        },
      },
    },
    height: 'auto',
    // 纵向虚拟滚动配置
    scrollY: {
      enabled: true,
      gt: 0,
    },
    // 工具栏配置
    toolbarConfig: {
      refresh: true, // 显示刷新按钮
      zoom: true,    // 显示全屏缩放按钮
      search: true,  // 显示搜索按钮
    },
    // 分页配置
    pagerConfig: { 
      enabled: false // 禁用分页（因为树形表格通常一次性加载所有数据）
    },
    // 行配置
    rowConfig: {
      keyField: 'ID', // 指定每行数据的唯一标识字段为 'ID'
    },
    // 树形表格配置
    treeConfig: {
      rowField: 'ID',       // 当前行的唯一标识字段
      parentField: 'parentID', // 父级行的标识字段
      transform: true,      // 开启数据转换（将扁平数组自动转换为树形结构）
      expandAll: true,      // 默认展开所有树节点
    },
  },
});

// 返回两个值：
// 1. MenuDrawerComp: 抽屉的 Vue 组件实例，需要挂载到当前页面的模板（template）中
// 2. menuDrawerApi: 用于控制抽屉的 API 对象（如打开、关闭、传递数据等）
const [MenuDrawerComp, menuDrawerApi] = useVbenDrawer({
  class: 'w-180',
  // 关联实际的抽屉内容子组件
  connectedComponent: MenuDrawer,
});

function openAdd(parentId?: number) {
  menuDrawerApi.setData({
    parentID: parentId,
    isEdit: false,
    onSuccess: () => gridApi.query(),
  });
  menuDrawerApi.open();
}

function openEdit(record: any) {
  menuDrawerApi.setData({
    record,
    isEdit: true,
    onSuccess: () => gridApi.query(),
  });
  menuDrawerApi.open();
}

async function handleDelete(id: number) {
  try {
    await deleteMenuApi({ ID: id });
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
          {{ $t('system.menu.addTitle') }}
        </Button>
      </template>
      <template #nameSlot="{ row }">
        <span class="flex items-center gap-1">
          <IconifyIcon
            v-if="row.meta?.icon"
            :icon="row.meta.icon"
            class="size-4"
          />
          {{ row.name }}
        </span>
      </template>
      <template #titleSlot="{ row }">
        {{ row.meta?.title }}
      </template>
      <template #disabledSlot="{ row }">
        <Switch :checked="!row.disabled" disabled size="small" />
      </template>
      <template #actionSlot="{ row }">
        <a-button size="small" type="link" @click="openEdit(row)">
          {{ $t('system.action.edit') }}
        </a-button>
        <a-button size="small" type="link" @click="openAdd(row.ID)">
          {{ $t('system.action.addChild') }}
        </a-button>
        <a-popconfirm
          :title="$t('system.confirm.deleteMenu')"
          @confirm="handleDelete(row.ID)"
        >
          <a-button size="small" type="link" danger>
            {{ $t('system.action.delete') }}
          </a-button>
        </a-popconfirm>
      </template>
    </Grid>

    <MenuDrawerComp />
  </Page>
</template>
