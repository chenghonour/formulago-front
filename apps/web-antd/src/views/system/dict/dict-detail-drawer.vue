<script setup lang="ts">
import type { CreateOrUpdateDictDetailReq } from '#/api/system/model/dictModel';

import { ref } from 'vue';

import { useVbenDrawer } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createDictDetailApi, updateDictDetailApi } from '#/api/system/dict';
import { $t } from '#/locales';

import { createDefaultDetailForm, dictDetailFormSchemas } from './dict.data';

const drawerTitle = ref('');

const [Form, formApi] = useVbenForm({
  schema: dictDetailFormSchemas,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-6',
});

const [Drawer, drawerApi] = useVbenDrawer({
  onOpened() {
    const data = drawerApi.getData<{
      isEdit: boolean;
      onSuccess: () => void;
      parentID?: number;
      record?: Partial<CreateOrUpdateDictDetailReq>;
    }>();
    drawerTitle.value = data.isEdit
      ? $t('system.dict.detailEditTitle')
      : $t('system.dict.detailTitle');
    if (data.isEdit && data.record) {
      formApi.setValues({
        ...createDefaultDetailForm(),
        ...data.record,
        status: data.record.status === 1,
      });
    } else {
      formApi.setValues({
        ...createDefaultDetailForm(),
        parentID: data.parentID,
        status: true,
      });
    }
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = (await formApi.getValues()) as any;
    const data = drawerApi.getData<{
      isEdit: boolean;
      onSuccess?: () => void;
      parentID?: number;
      record?: Partial<CreateOrUpdateDictDetailReq>;
    }>();

    drawerApi.lock(true);
    try {
      const payload: Record<string, any> = {
        ...values,
        status: values.status ? 1 : 0,
      };

      if (!data.isEdit) {
        payload.parentID = data.parentID;
      }

      if (data.isEdit && data.record?.ID) {
        await updateDictDetailApi({ ...payload, ID: data.record.ID });
        message.success($t('system.message.updateSuccess'));
      } else {
        await createDictDetailApi(payload);
        message.success($t('system.message.createSuccess'));
      }
      data.onSuccess?.();
      drawerApi.close();
    } catch (error) {
      console.error(error);
    } finally {
      drawerApi.lock(false);
    }
  },
});
</script>

<template>
  <Drawer :title="drawerTitle">
    <Form />
  </Drawer>
</template>
