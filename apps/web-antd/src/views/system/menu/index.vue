<script setup lang="ts">
import { reactive, ref } from 'vue';

import { useVbenModal } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import {
  createMenuApi,
  deleteMenuApi,
  getMenuListApi,
  updateMenuApi,
} from '#/api/core/menu-admin';
import { $t } from '#/locales';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { IconifyIcon } from '@formulago/icons';

/** 将嵌套树形数据压平为一维数组 */
function flattenTree(items: any[]): any[] {
  const result: any[] = [];
  const walk = (list: any[]) => {
    for (const item of list) {
      const { children, ...rest } = item;
      result.push(rest);
      if (children?.length) walk(children);
    }
  };
  walk(items);
  return result;
}

defineOptions({ name: 'SystemMenu' });

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: [
      { component: 'Input', fieldName: 'name', label: $t('system.column.name'), componentProps: { placeholder: $t('system.menu.placeholder.name') } },
      { component: 'Input', fieldName: 'title', label: $t('system.column.title'), componentProps: { placeholder: $t('system.menu.placeholder.title') } },
    ],
  },
  gridOptions: {
    columns: [
      { field: 'ID', title: 'ID', width: 80 },
      { field: 'name', title: $t('system.column.name'), width: 200, treeNode: true, slots: { default: 'nameSlot' } },
      {
        field: 'title',
        title: $t('system.column.title'),
        width: 150,
        slots: { default: 'titleSlot' },
      },
      { field: 'path', title: $t('system.column.path'), minWidth: 160 },
      { field: 'component', title: $t('system.column.component'), minWidth: 160 },
      { field: 'orderNo', title: $t('system.column.order'), width: 80 },
      {
        field: 'menuType',
        title: $t('system.column.type'),
        width: 100,
        formatter: ({ cellValue }: { cellValue: number }) => getMenuTypeText(cellValue),
      },
      {
        field: 'action',
        title: $t('system.column.action'),
        width: 250,
        slots: { default: 'actionSlot' },
      },
    ],
    proxyConfig: {
      ajax: {
        query: async (params: any, customValues: any) => {
          const f = customValues ?? {};
          const result = await getMenuListApi({
            page: params.page,
            pageSize: params.pageSize,
            name: f.name || '',
            title: f.title || '',
          });
          // 后端返回嵌套数据，压平后由 treeConfig.transform 重建树形
          return { items: flattenTree(result.data || []), total: result.total };
        },
      },
    },
    toolbarConfig: {
      refresh: true,
      zoom: true,
      search: true,
    },
    pagerConfig: { enabled: false },
    rowConfig: {
      keyField: 'ID',
    },
    treeConfig: {
      rowField: 'ID',
      parentField: 'parentID',
      transform: true,
      expandAll: true,
    },
  },
});

const editForm = reactive<any>({
  ID: undefined,
  parentID: 0,
  name: '',
  path: '',
  component: '',
  redirect: '',
  orderNo: 0,
  menuType: 0,
  disabled: false,
  meta: {
    title: '',
    icon: '',
    hideMenu: false,
    hideBreadcrumb: false,
    ignoreKeepAlive: false,
    affix: false,
    frameSrc: '',
    hideChildrenInMenu: false,
  },
});
const editTitle = ref('');

const [MenuModal, menuModalApi] = useVbenModal({
  onCancel() {
    menuModalApi.close();
  },
  onConfirm() {
    handleSave();
  },
});

function openAdd(parentId?: number) {
  editTitle.value = parentId ? $t('system.menu.addChildTitle') : $t('system.menu.addTitle');
  resetForm();
  if (parentId) {
    editForm.parentID = parentId;
  }
  menuModalApi.open();
}

function openEdit(record: any) {
  editTitle.value = $t('system.menu.editTitle');
  editForm.ID = record.ID;
  editForm.parentID = record.parentID;
  editForm.name = record.name;
  editForm.path = record.path;
  editForm.component = record.component;
  editForm.redirect = record.redirect;
  editForm.orderNo = record.orderNo;
  editForm.menuType = record.menuType;
  editForm.disabled = record.disabled;
  editForm.meta = { ...record.meta };
  menuModalApi.open();
}

function resetForm() {
  editForm.ID = undefined;
  editForm.parentID = 0;
  editForm.name = '';
  editForm.path = '';
  editForm.component = '';
  editForm.redirect = '';
  editForm.orderNo = 0;
  editForm.menuType = 0;
  editForm.disabled = false;
  editForm.meta = {
    title: '',
    icon: '',
    hideMenu: false,
    hideBreadcrumb: false,
    ignoreKeepAlive: false,
    affix: false,
    frameSrc: '',
    hideChildrenInMenu: false,
  };
}

function getMenuTypeText(menuType: number) {
  const map: Record<number, string> = {
    0: $t('system.menu.form.directory'),
    1: $t('system.menu.form.menu'),
    2: $t('system.menu.form.button'),
  };
  return map[menuType] || $t('system.menu.form.unknown');
}

async function handleSave() {
  try {
    const data = {
      ID: editForm.ID || undefined,
      parentID: editForm.parentID,
      name: editForm.name,
      path: editForm.path,
      component: editForm.component,
      redirect: editForm.redirect || undefined,
      orderNo: editForm.orderNo,
      menuType: editForm.menuType,
      disabled: editForm.disabled,
      meta: editForm.meta,
    };
    if (editForm.ID) {
      await updateMenuApi(data);
      message.success($t('system.message.updateSuccess'));
    } else {
      await createMenuApi(data);
      message.success($t('system.message.createSuccess'));
    }
    menuModalApi.close();
    gridApi.query();
  } catch (error) {
    console.error(error);
  }
}

async function handleDelete(id: number) {
  try {
    await deleteMenuApi(id);
    message.success($t('system.message.deleteSuccess'));
    gridApi.query();
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="p-4">
    <Grid>
      <template #table-title>
        <div class="flex items-center gap-2">
          <span class="text-[1rem] font-bold">{{ $t('system.menu.title') }}</span>
          <a-button type="primary" @click="openAdd()">{{ $t('system.menu.addTitle') }}</a-button>
        </div>
      </template>
      <template #nameSlot="{ row }">
        <span class="flex items-center gap-1">
          <IconifyIcon v-if="row.meta?.icon" :icon="row.meta.icon" class="size-4" />
          {{ row.name }}
        </span>
      </template>
      <template #titleSlot="{ row }">
        {{ row.meta?.title }}
      </template>
      <template #actionSlot="{ row }">
        <a-button size="small" type="link" @click="openEdit(row)">{{ $t('system.action.edit') }}</a-button>
        <a-button size="small" type="link" @click="openAdd(row.ID)">{{ $t('system.action.addChild') }}</a-button>
        <a-popconfirm :title="$t('system.confirm.deleteMenu')" @confirm="handleDelete(row.ID)">
          <a-button size="small" type="link" danger>{{ $t('system.action.delete') }}</a-button>
        </a-popconfirm>
      </template>
    </Grid>

    <MenuModal :title="editTitle" style="width: 600px">
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="$t('system.menu.form.name')">
              <a-input v-model:value="editForm.name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('system.menu.form.title')">
              <a-input v-model:value="editForm.meta.title" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="$t('system.menu.form.path')">
              <a-input v-model:value="editForm.path" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('system.menu.form.component')">
              <a-input v-model:value="editForm.component" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="$t('system.menu.form.redirect')">
              <a-input v-model:value="editForm.redirect" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('system.menu.form.icon')">
              <a-input v-model:value="editForm.meta.icon" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item :label="$t('system.menu.form.order')">
              <a-input-number v-model:value="editForm.orderNo" class="w-full" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="$t('system.menu.form.parentID')">
              <a-input-number v-model:value="editForm.parentID" class="w-full" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="$t('system.menu.form.menuType')">
              <a-select v-model:value="editForm.menuType">
                <a-select-option :value="0">{{ $t('system.menu.form.directory') }}</a-select-option>
                <a-select-option :value="1">{{ $t('system.menu.form.menu') }}</a-select-option>
                <a-select-option :value="2">{{ $t('system.menu.form.button') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item :label="$t('system.menu.form.hideMenu')">
              <a-switch v-model:checked="editForm.meta.hideMenu" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="$t('system.menu.form.hideBreadcrumb')">
              <a-switch v-model:checked="editForm.meta.hideBreadcrumb" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="$t('system.menu.form.ignoreKeepAlive')">
              <a-switch v-model:checked="editForm.meta.ignoreKeepAlive" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item :label="$t('system.menu.form.affixTab')">
              <a-switch v-model:checked="editForm.meta.affix" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="$t('system.menu.form.hideChildrenInMenu')">
              <a-switch v-model:checked="editForm.meta.hideChildrenInMenu" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="$t('system.menu.form.disabled')">
              <a-switch v-model:checked="editForm.disabled" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :label="$t('system.menu.form.frameSrc')">
          <a-input v-model:value="editForm.meta.frameSrc" />
        </a-form-item>
      </a-form>
    </MenuModal>
  </div>
</template>
