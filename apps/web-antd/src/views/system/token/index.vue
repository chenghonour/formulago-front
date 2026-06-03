<script setup lang="ts">
import { reactive, ref } from 'vue';

import { useVbenModal } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import { deleteTokenApi, getTokenListApi, updateTokenApi } from '#/api';
import { $t } from '#/locales';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

defineOptions({ name: 'SystemToken' });

const editForm = reactive<any>({ ID: undefined, token: '', source: '', expiredAt: '' });
const editTitle = ref('');
const [TokenModal, tokenModalApi] = useVbenModal({
  onCancel() { tokenModalApi.close(); },
  onConfirm() { handleSave(); },
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: [
      { component: 'Input', fieldName: 'username', label: $t('system.column.username'), componentProps: { placeholder: $t('system.token.placeholder.username') } },
    ],
  },
  tableTitle: $t('system.tableTitle'),
  gridOptions: {
    columns: [
      { field: 'ID', title: $t('system.column.id'), width: 80 },
      { field: 'userName', title: $t('system.column.username'), width: 120 },
      { field: 'token', title: $t('system.column.token') },
      { field: 'source', title: $t('system.column.source'), width: 100 },
      { field: 'expiredAt', title: $t('system.column.expiredAt'), width: 180 },
      { field: 'createdAt', title: $t('system.column.createdAt'), width: 180 },
      { field: 'action', title: $t('system.column.action'), width: 200, slots: { default: 'actionSlot' } },
    ],
    proxyConfig: {
      ajax: {
        query: async (params: any, customValues: any) => {
          const f = customValues ?? {};
          const result = await getTokenListApi({ page: params.page, pageSize: params.pageSize, username: f.username || '' });
          return { items: result.data, total: result.total };
        },
      },
    },
    toolbarConfig: {
          refresh: true,
          zoom: true, search: true },
  },
});

function openEdit(record: any) {
  editTitle.value = $t('system.token.editTitle');
  Object.assign(editForm, { ID: record.ID, token: record.token, source: record.source, expiredAt: record.expiredAt });
  tokenModalApi.open();
}
async function handleSave() {
  try { await updateTokenApi(editForm); message.success($t('system.message.updateSuccess')); tokenModalApi.close(); gridApi.query(); }
  catch (error) { console.error(error); }
}
async function handleDelete(userID: number) {
  try { await deleteTokenApi(userID); message.success($t('system.message.deleteSuccess')); gridApi.query(); }
  catch (error) { console.error(error); }
}
</script>

<template>
  <div class="p-4">
    <Grid>
      <template #actionSlot="{ row }">
        <a-button size="small" type="link" @click="openEdit(row)">{{ $t('system.action.edit') }}</a-button>
        <a-button size="small" type="link" danger @click="handleDelete(row.userID)">{{ $t('system.action.delete') }}</a-button>
      </template>
    </Grid>

    <TokenModal :title="editTitle">
      <a-form layout="vertical">
        <a-form-item :label="$t('system.column.token')"><a-input v-model:value="editForm.token" /></a-form-item>
        <a-form-item :label="$t('system.column.source')"><a-input v-model:value="editForm.source" /></a-form-item>
        <a-form-item :label="$t('system.column.expiredAt')"><a-input v-model:value="editForm.expiredAt" /></a-form-item>
      </a-form>
    </TokenModal>
  </div>
</template>
