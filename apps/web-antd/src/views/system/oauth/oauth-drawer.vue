<script setup lang="ts">
import type { ProviderInfo } from '#/api/system/model/oauthModel';

import { ref } from 'vue';

import { useVbenDrawer } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createProviderApi, updateProviderApi } from '#/api/system/oauth';
import { $t } from '#/locales';

import { createDefaultForm, oauthFormSchemas } from './oauth.data';

const drawerTitle = ref('');

const [Form, formApi] = useVbenForm({
  schema: oauthFormSchemas,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-6',
});

const [Drawer, drawerApi] = useVbenDrawer({
  onOpened() {
    const data = drawerApi.getData<{
      isEdit: boolean;
      record?: Partial<ProviderInfo>;
      onSuccess?: () => void;
    }>();
    drawerTitle.value = data.isEdit
      ? $t('system.oauth.editTitle')
      : $t('system.oauth.addTitle');
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
      record?: Partial<ProviderInfo>;
    }>();

    drawerApi.lock(true);
    try {
      if (data.isEdit && data.record?.id) {
        await updateProviderApi({ ...values, id: data.record.id });
        message.success($t('system.message.updateSuccess'));
      } else {
        await createProviderApi(values);
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
