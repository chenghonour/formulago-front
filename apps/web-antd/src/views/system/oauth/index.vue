<script setup lang="ts">
import { reactive, ref } from 'vue';

import { useVbenModal } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import { createProviderApi, deleteProviderApi, getProviderListApi, updateProviderApi } from '#/api';
import { $t } from '#/locales';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

defineOptions({ name: 'SystemOAuth' });

const editForm = reactive<any>({ id: undefined, name: '', clientID: '', clientSecret: '', redirectUrl: '', scopes: '', authUrl: '', tokenUrl: '', authStyle: 0, infoUrl: '' });
const editTitle = ref('');
const [OAuthModal, oauthModalApi] = useVbenModal({
  onCancel() { oauthModalApi.close(); },
  onConfirm() { handleSave(); },
});

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: $t('system.tableTitle'),
  gridOptions: {
    columns: [
      { field: 'id', title: $t('system.column.id'), width: 80 },
      { field: 'name', title: $t('system.column.name'), width: 150 },
      { field: 'clientID', title: $t('system.column.clientID'), width: 200 },
      { field: 'authUrl', title: $t('system.column.authUrl') },
      { field: 'tokenUrl', title: $t('system.column.tokenUrl') },
      { field: 'action', title: $t('system.column.action'), width: 200, slots: { default: 'actionSlot' } },
    ],
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
      buttons: [{ code: 'add', name: $t('system.oauth.addTitle'), status: 'primary' }],
    },
  },
  gridEvents: {
    toolbarButtonClick: ({ code }: { code: string }) => {
      if (code === 'add') openAddOAuth();
    },
  },
});

function openAddOAuth() {
  editTitle.value = $t('system.oauth.addTitle');
  Object.assign(editForm, { id: undefined, name: '', clientID: '', clientSecret: '', redirectUrl: '', scopes: '', authUrl: '', tokenUrl: '', authStyle: 0, infoUrl: '' });
  oauthModalApi.open();
}

function openEdit(record: any) {
  editTitle.value = $t('system.oauth.editTitle');
  Object.assign(editForm, record);
  oauthModalApi.open();
}
async function handleSave() {
  try {
    if (editForm.id) { await updateProviderApi(editForm); message.success($t('system.message.updateSuccess')); }
    else { await createProviderApi(editForm); message.success($t('system.message.createSuccess')); }
    oauthModalApi.close(); gridApi.query();
  } catch (error) { console.error(error); }
}
async function handleDelete(id: number) {
  try { await deleteProviderApi(id); message.success($t('system.message.deleteSuccess')); gridApi.query(); }
  catch (error) { console.error(error); }
}
</script>

<template>
  <div class="p-4">
    <Grid>
      <template #table-title>
        <div class="flex items-center gap-2">
          <span class="text-[1rem] font-bold">{{ $t('system.tableTitle') }}</span>
          <a-button type="primary" size="small" @click="openAddOAuth">{{ $t('system.oauth.addTitle') }}</a-button>
        </div>
      </template>
      <template #actionSlot="{ row }">
        <a-button size="small" type="link" @click="openEdit(row)">{{ $t('system.action.edit') }}</a-button>
        <a-button size="small" type="link" danger @click="handleDelete(row.id)">{{ $t('system.action.delete') }}</a-button>
      </template>
    </Grid>

    <OAuthModal :title="editTitle" style="width: 600px">
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item :label="$t('system.column.name')"><a-input v-model:value="editForm.name" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item :label="$t('system.column.clientID')"><a-input v-model:value="editForm.clientID" /></a-form-item></a-col>
        </a-row>
        <a-form-item :label="$t('system.column.clientSecret')"><a-input-password v-model:value="editForm.clientSecret" /></a-form-item>
        <a-form-item :label="$t('system.column.redirectUrl')"><a-input v-model:value="editForm.redirectUrl" /></a-form-item>
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item :label="$t('system.column.authUrl')"><a-input v-model:value="editForm.authUrl" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item :label="$t('system.column.tokenUrl')"><a-input v-model:value="editForm.tokenUrl" /></a-form-item></a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item :label="$t('system.column.infoUrl')"><a-input v-model:value="editForm.infoUrl" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item :label="$t('system.column.scopes')"><a-input v-model:value="editForm.scopes" /></a-form-item></a-col>
        </a-row>
      </a-form>
    </OAuthModal>
  </div>
</template>
