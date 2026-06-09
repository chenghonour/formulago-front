<script setup lang="ts">
import type { ApiInfo } from '#/api/system/model/apiModel';

import { ref } from 'vue';

import { useVbenDrawer } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createApiApi, updateApiApi } from '#/api/system/apis';
import { $t } from '#/locales';

import { apiFormSchemas, createDefaultForm } from './api.data';

const drawerTitle = ref('');

const [Form, formApi] = useVbenForm({
  schema: apiFormSchemas,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-6',
});

const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-100',
  onOpened() {
    const data = drawerApi.getData<{
      isEdit: boolean;
      onSuccess?: () => void;
      record?: Partial<ApiInfo>;
    }>();
    drawerTitle.value = data.isEdit
      ? $t('system.api.editTitle')
      : $t('system.api.addTitle');
    if (data.isEdit && data.record) {
      formApi.setValues({ ...createDefaultForm(), ...data.record });
    } else {
      formApi.setValues(createDefaultForm());
    }
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    const data = drawerApi.getData<{
      isEdit: boolean;
      onSuccess?: () => void;
      record?: Partial<ApiInfo>;
    }>();

    drawerApi.lock(true);
    try {
      if (data.isEdit && data.record?.ID) {
        await updateApiApi({ ...values, ID: data.record.ID });
        message.success($t('system.message.updateSuccess'));
      } else {
        await createApiApi(values);
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
