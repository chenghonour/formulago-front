<script setup lang="ts">
import { reactive, ref } from 'vue';

import { useVbenModal } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import {
  createUserApi,
  deleteUserApi,
  getUserListApi,
  updateUserApi,
  updateUserStatusApi,
} from '#/api';
import { $t } from '#/locales';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

defineOptions({ name: 'SystemUser' });

const editForm = reactive<any>({
  ID: undefined,
  username: '',
  nickname: '',
  password: '',
  email: '',
  mobile: '',
  roleID: undefined,
  avatar: '',
  status: 1,
});
const editTitle = ref('');

const [UserModal, userModalApi] = useVbenModal({
  onCancel() {
    userModalApi.close();
  },
  onConfirm() {
    handleSave();
  },
});

function openAdd() {
  editTitle.value = $t('system.user.addTitle');
  Object.assign(editForm, {
    ID: undefined,
    username: '',
    nickname: '',
    password: '',
    email: '',
    mobile: '',
    roleID: undefined,
    avatar: '',
    status: 1,
  });
  userModalApi.open();
}

function openEdit(record: any) {
  editTitle.value = $t('system.user.editTitle');
  Object.assign(editForm, {
    ID: record.ID,
    username: record.username,
    nickname: record.nickname,
    password: '',
    email: record.email,
    mobile: record.mobile,
    roleID: record.roleID,
    avatar: record.avatar,
    status: record.status,
  });
  userModalApi.open();
}

async function handleSave() {
  try {
    if (editForm.ID) {
      await updateUserApi(editForm);
      message.success($t('system.message.updateSuccess'));
    } else {
      await createUserApi(editForm);
      message.success($t('system.message.createSuccess'));
    }
    userModalApi.close();
    gridApi.query();
  } catch (error) {
    console.error(error);
  }
}

async function handleDelete(id: number) {
  try {
    await deleteUserApi(id);
    message.success($t('system.message.deleteSuccess'));
    gridApi.query();
  } catch (error) {
    console.error(error);
  }
}

async function handleStatusChange(id: number, status: number) {
  try {
    await updateUserStatusApi(id, status);
    message.success($t('system.message.updateSuccess'));
    gridApi.query();
  } catch (error) {
    console.error(error);
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: [
      {
        component: 'Input',
        fieldName: 'username',
        label: $t('system.column.username'),
        componentProps: { placeholder: $t('system.user.placeholder.username') },
      },
      {
        component: 'Input',
        fieldName: 'nickname',
        label: $t('system.column.nickname'),
        componentProps: { placeholder: $t('system.user.placeholder.nickname') },
      },
      {
        component: 'Input',
        fieldName: 'email',
        label: $t('system.column.email'),
        componentProps: { placeholder: $t('system.user.placeholder.email') },
      },
      {
        component: 'Input',
        fieldName: 'mobile',
        label: $t('system.column.mobile'),
        componentProps: { placeholder: $t('system.user.placeholder.mobile') },
      },
    ],
  },
  tableTitle: $t('system.tableTitle'),
  gridOptions: {
    columns: [
      { field: 'ID', title: $t('system.column.id'), width: 80 },
      { field: 'username', title: $t('system.column.username'), width: 120 },
      { field: 'nickname', title: $t('system.column.nickname'), width: 120 },
      { field: 'roleName', title: $t('system.column.roleName'), width: 120 },
      { field: 'email', title: $t('system.column.email'), minWidth: 180 },
      { field: 'mobile', title: $t('system.column.mobile'), width: 140 },
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
          const filters = customValues ?? {};
          const result = await getUserListApi({
            page: params.page,
            pageSize: params.pageSize,
            username: filters.username || '',
            nickname: filters.nickname || '',
            email: filters.email || '',
            mobile: filters.mobile || '',
          });
          return { items: result.data, total: result.total };
        },
      },
    },
    toolbarConfig: {
          refresh: true,
          zoom: true,
      buttons: [
        { code: 'add', name: $t('system.user.addTitle'), status: 'primary' },
      ],
      search: true,
    },
  },
  gridEvents: {
    toolbarButtonClick: ({ code }: { code: string }) => {
      if (code === 'add') {
        openAdd();
      }
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
          <a-button type="primary" size="small" @click="openAdd">{{ $t('system.user.addTitle') }}</a-button>
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

    <UserModal :title="editTitle">
      <a-form layout="vertical">
        <a-form-item :label="$t('system.column.username')">
          <a-input v-model:value="editForm.username" />
        </a-form-item>
        <a-form-item :label="$t('system.column.nickname')">
          <a-input v-model:value="editForm.nickname" />
        </a-form-item>
        <a-form-item :label="$t('system.column.password')">
          <a-input-password v-model:value="editForm.password" />
        </a-form-item>
        <a-form-item :label="$t('system.column.email')">
          <a-input v-model:value="editForm.email" />
        </a-form-item>
        <a-form-item :label="$t('system.column.mobile')">
          <a-input v-model:value="editForm.mobile" />
        </a-form-item>
        <a-form-item :label="$t('system.column.roleID')">
          <a-input-number v-model:value="editForm.roleID" class="w-full" />
        </a-form-item>
        <a-form-item :label="$t('system.column.status')">
          <a-button type="primary"
            size="small"
            @click="editForm.status = editForm.status === 1 ? 0 : 1"
          >
            {{ editForm.status === 1 ? $t('system.status.enabled') : $t('system.status.disabled') }}
          </a-button>
        </a-form-item>
      </a-form>
    </UserModal>
  </div>
</template>
