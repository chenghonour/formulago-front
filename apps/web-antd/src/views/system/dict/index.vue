<script setup lang="ts">
import { reactive, ref } from 'vue';

import { useVbenModal } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import {
  createDictApi,
  createDictDetailApi,
  deleteDictApi,
  deleteDictDetailApi,
  getDictDetailListApi,
  getDictListApi,
  updateDictApi,
  updateDictDetailApi,
} from '#/api';
import { $t } from '#/locales';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

defineOptions({ name: 'SystemDict' });

const dictForm = reactive<any>({ ID: undefined, title: '', name: '', status: 1, description: '' });
const dictTitle = ref('');
const [DictModal, dictModalApi] = useVbenModal({
  onCancel() { dictModalApi.close(); },
  onConfirm() { handleSaveDict(); },
});
const selectedDict = ref<any>(null);
const details = ref<any[]>([]);
const loadingDetails = ref(false);

async function showDetails(record: any) {
  selectedDict.value = record;
  loadingDetails.value = true;
  try {
    const result = await getDictDetailListApi(record.name);
    details.value = Array.isArray(result) ? result : [];
  } finally { loadingDetails.value = false; }
}

const detailForm = reactive<any>({ ID: undefined, title: '', key: '', value: '', status: 1, parentID: undefined });
const detailTitle = ref('');
const [DetailModal, detailModalApi] = useVbenModal({
  onCancel() { detailModalApi.close(); },
  onConfirm() { handleSaveDetail(); },
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: [
      { component: 'Input', fieldName: 'title', label: $t('system.dict.filter.title'), componentProps: { placeholder: $t('system.dict.placeholder.title') } },
      { component: 'Input', fieldName: 'name', label: $t('system.dict.filter.name'), componentProps: { placeholder: $t('system.dict.placeholder.name') } },
    ],
  },
  tableTitle: $t('system.tableTitle'),
  gridOptions: {
    columns: [
      { field: 'ID', title: $t('system.column.id'), width: 80 },
      { field: 'title', title: $t('system.column.title'), width: 120 },
      { field: 'name', title: $t('system.column.key'), width: 150 },
      { field: 'description', title: $t('system.column.description') },
      { field: 'status', title: $t('system.column.status'), width: 80 },
      { field: 'action', title: $t('system.column.action'), width: 250, slots: { default: 'actionSlot' } },
    ],
    proxyConfig: {
      ajax: {
        query: async (params: any, customValues: any) => {
          const f = customValues ?? {};
          const result = await getDictListApi({ page: params.page, pageSize: params.pageSize, title: f.title || '', name: f.name || '' });
          return { items: result.data, total: result.total };
        },
      },
    },
    toolbarConfig: {
          refresh: true,
          zoom: true,
      buttons: [{ code: 'add', name: $t('system.dict.addTitle'), status: 'primary' }],
      search: true,
    },
  },
  gridEvents: {
    toolbarButtonClick: ({ code }: { code: string }) => {
      if (code === 'add') openAddDict();
    },
  },
});

function openAddDict() {
  dictTitle.value = $t('system.dict.addTitle');
  Object.assign(dictForm, { ID: undefined, title: '', name: '', status: 1, description: '' });
  dictModalApi.open();
}

function openEditDict(record: any) {
  dictTitle.value = $t('system.dict.editTitle');
  Object.assign(dictForm, { ID: record.ID, title: record.title, name: record.name, status: record.status, description: record.description });
  dictModalApi.open();
}
async function handleSaveDict() {
  try {
    if (dictForm.ID) { await updateDictApi(dictForm); message.success($t('system.message.updateSuccess')); }
    else { await createDictApi(dictForm); message.success($t('system.message.createSuccess')); }
    dictModalApi.close(); gridApi.query();
  } catch (error) { console.error(error); }
}
async function handleDeleteDict(id: number) {
  try { await deleteDictApi(id); message.success($t('system.message.deleteSuccess')); gridApi.query(); }
  catch (error) { console.error(error); }
}
function openAddDetail() {
  detailTitle.value = $t('system.dict.detailTitle');
  Object.assign(detailForm, { ID: undefined, title: '', key: '', value: '', status: 1, parentID: selectedDict.value?.ID });
  detailModalApi.open();
}
function openEditDetail(record: any) {
  detailTitle.value = $t('system.dict.detailEditTitle');
  Object.assign(detailForm, { ID: record.ID, title: record.title, key: record.key, value: record.value, status: record.status, parentID: record.parentID });
  detailModalApi.open();
}
async function handleSaveDetail() {
  try {
    if (detailForm.ID) { await updateDictDetailApi(detailForm); message.success($t('system.message.updateSuccess')); }
    else { await createDictDetailApi(detailForm); message.success($t('system.message.createSuccess')); }
    detailModalApi.close();
    if (selectedDict.value) showDetails(selectedDict.value);
  } catch (error) { console.error(error); }
}
async function handleDeleteDetail(id: number) {
  try { await deleteDictDetailApi(id); message.success($t('system.message.deleteSuccess')); if (selectedDict.value) showDetails(selectedDict.value); }
  catch (error) { console.error(error); }
}
</script>

<template>
  <div class="p-4">
    <Grid>
      <template #table-title>
        <div class="flex items-center gap-2">
          <span class="text-[1rem] font-bold">{{ $t('system.tableTitle') }}</span>
          <a-button type="primary" size="small" @click="openAddDict">{{ $t('system.dict.addTitle') }}</a-button>
        </div>
      </template>
      <template #actionSlot="{ row }">
        <a-button size="small" type="link" @click="showDetails(row)">{{ $t('system.action.detail') }}</a-button>
        <a-button size="small" type="link" @click="openEditDict(row)">{{ $t('system.action.edit') }}</a-button>
        <a-button size="small" type="link" danger @click="handleDeleteDict(row.ID)">{{ $t('system.action.delete') }}</a-button>
      </template>
    </Grid>

    <a-row v-if="selectedDict" :gutter="16" class="mt-4">
      <a-col :span="24">
        <div class="rounded bg-white p-4">
          <div class="mb-4 flex items-center justify-between">
            <span class="font-medium">{{ selectedDict.title }} - {{ $t('system.action.detail') }}</span>
            <a-button type="primary" size="small" @click="openAddDetail">{{ $t('system.dict.detailTitle') }}</a-button>
          </div>
          <vxe-table :data="details" :loading="loadingDetails" :row-config="{ keyField: 'ID' }" size="small">
            <vxe-column field="ID" :title="$t('system.column.id')" width="80" />
            <vxe-column field="title" :title="$t('system.column.title')" width="120" />
            <vxe-column field="key" :title="$t('system.column.key')" width="120" />
            <vxe-column field="value" :title="$t('system.column.value')" />
            <vxe-column field="status" :title="$t('system.column.status')" width="80" />
            <vxe-column :title="$t('system.column.action')" width="180">
              <template #default="{ row }">
                <a-button size="small" type="link" @click="openEditDetail(row)">{{ $t('system.action.edit') }}</a-button>
                <a-button size="small" type="link" danger @click="handleDeleteDetail(row.ID)">{{ $t('system.action.delete') }}</a-button>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </a-col>
    </a-row>

    <DictModal :title="dictTitle">
      <a-form layout="vertical">
        <a-form-item :label="$t('system.column.title')"><a-input v-model:value="dictForm.title" /></a-form-item>
        <a-form-item :label="$t('system.column.key')"><a-input v-model:value="dictForm.name" /></a-form-item>
        <a-form-item :label="$t('system.column.description')"><a-textarea v-model:value="dictForm.description" /></a-form-item>
        <a-form-item :label="$t('system.column.status')">
          <a-button size="small"
            @click="dictForm.status = dictForm.status === 1 ? 0 : 1">
            {{ dictForm.status === 1 ? $t('system.status.enabled') : $t('system.status.disabled') }}
          </a-button>
        </a-form-item>
      </a-form>
    </DictModal>

    <DetailModal :title="detailTitle">
      <a-form layout="vertical">
        <a-form-item :label="$t('system.column.title')"><a-input v-model:value="detailForm.title" /></a-form-item>
        <a-form-item :label="$t('system.column.key')"><a-input v-model:value="detailForm.key" /></a-form-item>
        <a-form-item :label="$t('system.column.value')"><a-input v-model:value="detailForm.value" /></a-form-item>
        <a-form-item :label="$t('system.column.status')">
          <a-button size="small"
            @click="detailForm.status = detailForm.status === 1 ? 0 : 1">
            {{ detailForm.status === 1 ? $t('system.status.enabled') : $t('system.status.disabled') }}
          </a-button>
        </a-form-item>
      </a-form>
    </DetailModal>
  </div>
</template>
