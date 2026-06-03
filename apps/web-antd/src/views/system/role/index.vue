<script setup lang="ts">
import { reactive, ref } from 'vue';

import { useVbenModal } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import {
  createRoleApi,
  deleteRoleApi,
  getRoleListApi,
  updateRoleApi,
  updateRoleStatusApi,
} from '#/api';
import { $t } from '#/locales';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

defineOptions({ name: 'SystemRole' });

const editForm = reactive<any>({
  ID: undefined,
  name: '',
  value: '',
  defaultRouter: '',
  status: 1,
  remark: '',
  orderNo: 0,
});
const editTitle = ref('');

const [RoleModal, roleModalApi] = useVbenModal({
  onCancel() {
    roleModalApi.close();
  },
  onConfirm() {
    handleSave();
  },
});

function openAdd() {
  editTitle.value = $t('system.role.addTitle');
  Object.assign(editForm, {
    ID: undefined,
    name: '',
    value: '',
    defaultRouter: '',
    status: 1,
    remark: '',
    orderNo: 0,
  });
  roleModalApi.open();
}

function openEdit(record: any) {
  editTitle.value = $t('system.role.editTitle');
  Object.assign(editForm, {
    ID: record.ID,
    name: record.name,
    value: record.value,
    defaultRouter: record.defaultRouter,
    status: record.status,
    remark: record.remark,
    orderNo: record.orderNo,
  });
  roleModalApi.open();
}

async function handleSave() {
  try {
    if (editForm.ID) {
      await updateRoleApi(editForm);
      message.success($t('system.message.updateSuccess'));
    } else {
      await createRoleApi(editForm);
      message.success($t('system.message.createSuccess'));
    }
    roleModalApi.close();
    gridApi.query();
  } catch (error) {
    console.error(error);
  }
}

async function handleDelete(id: number) {
  try {
    await deleteRoleApi(id);
    message.success($t('system.message.deleteSuccess'));
    gridApi.query();
  } catch (error) {
    console.error(error);
  }
}

async function handleStatusChange(id: number, status: number) {
  try {
    await updateRoleStatusApi(id, status);
    message.success($t('system.message.updateSuccess'));
    gridApi.query();
  } catch (error) {
    console.error(error);
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: [
      { component: 'Input', fieldName: 'name', label: $t('system.column.name'), componentProps: { placeholder: $t('system.role.placeholder.name') } },
      {
        component: 'Select', fieldName: 'status', label: $t('system.column.status'),
        componentProps: { placeholder: $t('system.placeholder.select'), options: [
          { label: $t('system.httpMethod.all'), value: '' }, { label: $t('system.status.enabled'), value: '1' }, { label: $t('system.status.disabled'), value: '0' },
        ]},
      },
    ],
  },
  tableTitle: $t('system.tableTitle'),
  gridOptions: {
    columns: [
      { field: 'ID', title: $t('system.column.id'), width: 80 },
      { field: 'name', title: $t('system.column.name'), width: 150 },
      { field: 'value', title: $t('system.column.key'), width: 150 },
      { field: 'defaultRouter', title: $t('system.column.defaultRouter'), width: 200 },
      { field: 'orderNo', title: $t('system.column.order'), width: 80 },
      { field: 'remark', title: $t('system.column.remark') },
      {
        field: 'status',
        title: $t('system.column.status'),
        width: 100,
        slots: { default: 'statusSlot' },
      },
      { field: 'createdAt', title: $t('system.column.createdAt'), width: 180 },
      {
        field: 'action',
        title: $t('system.column.action'),
        width: 200,
        slots: { default: 'actionSlot' },
      },
    ],
    proxyConfig: {
      ajax: {
        query: async (params: any, customValues: any) => {
          const f = customValues ?? {};
          const result = await getRoleListApi({
            page: params.page,
            pageSize: params.pageSize,
            name: f.name || '',
            status: f.status === '' || f.status === undefined ? undefined : f.status,
          });
          return { items: result.data, total: result.total };
        },
      },
    },
    toolbarConfig: {
          refresh: true,
          zoom: true,
      buttons: [
        { code: 'add', name: $t('system.role.addTitle'), status: 'primary' },
      ],
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
          <a-button type="primary" size="small" @click="openAdd">{{ $t('system.role.addTitle') }}</a-button>
        </div>
      </template>
      <template #statusSlot="{ row }">
        <a-button type="primary"
          size="small"
          @click="handleStatusChange(row.ID, row.status === 1 ? 0 : 1)"
        >
          {{ row.status === 1 ? $t('system.status.enabled') : $t('system.status.disabled') }}
        </a-button>
      </template>
      <template #actionSlot="{ row }">
        <a-button size="small" type="link" @click="openEdit(row)">{{ $t('system.action.edit') }}</a-button>
        <a-button size="small" type="link" danger @click="handleDelete(row.ID)">{{ $t('system.action.delete') }}</a-button>
      </template>
    </Grid>

    <RoleModal :title="editTitle">
      <a-form layout="vertical">
        <a-form-item :label="$t('system.column.name')"><a-input v-model:value="editForm.name" /></a-form-item>
        <a-form-item :label="$t('system.column.key')"><a-input v-model:value="editForm.value" /></a-form-item>
        <a-form-item :label="$t('system.column.defaultRouter')"><a-input v-model:value="editForm.defaultRouter" /></a-form-item>
        <a-form-item :label="$t('system.column.order')"><a-input-number v-model:value="editForm.orderNo" class="w-full" /></a-form-item>
        <a-form-item :label="$t('system.column.remark')"><a-textarea v-model:value="editForm.remark" :rows="3" /></a-form-item>
        <a-form-item :label="$t('system.column.status')">
          <a-button type="primary"
            size="small"
            @click="editForm.status = editForm.status === 1 ? 0 : 1"
          >
            {{ editForm.status === 1 ? $t('system.status.enabled') : $t('system.status.disabled') }}
          </a-button>
        </a-form-item>
      </a-form>
    </RoleModal>
  </div>
</template>
