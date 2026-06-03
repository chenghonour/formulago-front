<script setup lang="ts">
import { reactive, ref } from 'vue';

import { useVbenModal } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import {
  createApiApi,
  deleteApiApi,
  getApiListApi,
  updateApiApi,
} from '#/api';
import { $t } from '#/locales';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

defineOptions({ name: 'SystemApi' });

const editForm = reactive<any>({
  ID: undefined,
  path: '',
  description: '',
  group: '',
  method: 'GET',
});
const editTitle = ref('');

const [ApiModal, apiModalApi] = useVbenModal({
  onCancel() {
    apiModalApi.close();
  },
  onConfirm() {
    handleSave();
  },
});

function openAdd() {
  editTitle.value = $t('system.api.addTitle');
  Object.assign(editForm, { ID: undefined, path: '', description: '', group: '', method: 'GET' });
  apiModalApi.open();
}

function openEdit(record: any) {
  editTitle.value = $t('system.api.editTitle');
  Object.assign(editForm, { ID: record.ID, path: record.path, description: record.description, group: record.group, method: record.method });
  apiModalApi.open();
}

async function handleSave() {
  try {
    if (editForm.ID) {
      await updateApiApi(editForm);
      message.success($t('system.message.updateSuccess'));
    } else {
      await createApiApi(editForm);
      message.success($t('system.message.createSuccess'));
    }
    apiModalApi.close();
    gridApi.query();
  } catch (error) {
    console.error(error);
  }
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

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: [
      { component: 'Input', fieldName: 'path', label: $t('system.column.path'), componentProps: { placeholder: $t('system.api.placeholder.path') } },
      { component: 'Input', fieldName: 'description', label: $t('system.column.description'), componentProps: { placeholder: $t('system.api.placeholder.description') } },
      { component: 'Input', fieldName: 'group', label: $t('system.column.group'), componentProps: { placeholder: $t('system.api.placeholder.group') } },
      {
        component: 'Select',
        fieldName: 'method',
        label: $t('system.column.method'),
        componentProps: {
          placeholder: $t('system.api.placeholder.method'),
          options: [
            { label: $t('system.httpMethod.all'), value: '' },
            { label: $t('system.httpMethod.get'), value: 'GET' },
            { label: $t('system.httpMethod.post'), value: 'POST' },
            { label: $t('system.httpMethod.put'), value: 'PUT' },
            { label: $t('system.httpMethod.delete'), value: 'DELETE' },
          ],
        },
      },
    ],
  },
  tableTitle: $t('system.tableTitle'),
  gridOptions: {
    columns: [
      { field: 'ID', title: $t('system.column.id'), width: 80 },
      { field: 'path', title: $t('system.column.path') },
      { field: 'description', title: $t('system.column.description'), width: 150 },
      { field: 'group', title: $t('system.column.group'), width: 120 },
      { field: 'method', title: $t('system.column.method'), width: 100 },
      { field: 'action', title: $t('system.column.action'), width: 200, slots: { default: 'actionSlot' } },
    ],
    proxyConfig: {
      ajax: {
        query: async (params: any, customValues: any) => {
          const f = customValues ?? {};
          const result = await getApiListApi({ page: params.page, pageSize: params.pageSize, path: f.path || '', description: f.description || '', group: f.group || '', method: f.method || '' });
          return { items: result.data, total: result.total };
        },
      },
    },
    toolbarConfig: {
          refresh: true,
          zoom: true,
      buttons: [{ code: 'add', name: $t('system.api.addTitle'), status: 'primary' }],
      search: true,
    },
  },
  gridEvents: {
    toolbarButtonClick: ({ code }: { code: string }) => {
      if (code === 'add') openAdd();
    },
  },
});
</script>

<template>
  <div class="p-4">
    <Grid>
      <template #table-title>
        <div class="flex items-center gap-2">
          <span class="text-[1rem] font-bold">{{ $t('system.tableTitle') }}</span>
          <a-button type="primary" size="small" @click="openAdd">{{ $t('system.api.addTitle') }}</a-button>
        </div>
      </template>
      <template #actionSlot="{ row }">
        <a-button size="small" type="link" @click="openEdit(row)">{{ $t('system.action.edit') }}</a-button>
        <a-button size="small" type="link" danger @click="handleDelete(row.ID)">{{ $t('system.action.delete') }}</a-button>
      </template>
    </Grid>

    <ApiModal :title="editTitle">
      <a-form layout="vertical">
        <a-form-item :label="$t('system.column.path')"><a-input v-model:value="editForm.path" /></a-form-item>
        <a-form-item :label="$t('system.column.description')"><a-input v-model:value="editForm.description" /></a-form-item>
        <a-form-item :label="$t('system.column.group')"><a-input v-model:value="editForm.group" /></a-form-item>
        <a-form-item :label="$t('system.column.method')">
          <a-select v-model:value="editForm.method">
            <a-select-option value="GET">GET</a-select-option>
            <a-select-option value="POST">POST</a-select-option>
            <a-select-option value="PUT">PUT</a-select-option>
            <a-select-option value="DELETE">DELETE</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </ApiModal>
  </div>
</template>
