<script setup lang="ts">
import type { TokenInfo } from '#/api/system/model/tokenModel';

import { ref } from 'vue';

import { useVbenDrawer } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { updateTokenApi } from '#/api/system/token';
import { $t } from '#/locales';

import { createDefaultForm, tokenFormSchemas } from './token.data';

const drawerTitle = ref('');

const [Form, formApi] = useVbenForm({
  schema: tokenFormSchemas,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-6',
});

const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-100',
  onOpened() {
    const data = drawerApi.getData<{
      isEdit: boolean;
      onSuccess?: () => void;
      record?: Partial<TokenInfo>;
    }>();
    drawerTitle.value = $t('system.token.editTitle');
    if (data.record) {
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
      record?: Partial<TokenInfo>;
    }>();

    drawerApi.lock(true);
    try {
      if (data.record?.ID) {
        await updateTokenApi({ ...values, ID: data.record.ID });
        message.success($t('system.message.updateSuccess'));
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
