<script setup lang="ts">
import type { CreateOrUpdateDictReq } from '#/api/system/model/dictModel';

import { ref } from 'vue';

import { useVbenDrawer } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createDictApi, updateDictApi } from '#/api/system/dict';
import { $t } from '#/locales';

import { createDefaultDictForm, dictFormSchemas } from './dict.data';

const drawerTitle = ref('');

const [Form, formApi] = useVbenForm({
  schema: dictFormSchemas,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-6',
});

const [Drawer, drawerApi] = useVbenDrawer({
  onOpened() {
    const data = drawerApi.getData<{
      isEdit: boolean;
      onSuccess?: () => void;
      record?: Partial<CreateOrUpdateDictReq>;
    }>();
    drawerTitle.value = data.isEdit
      ? $t('system.dict.editTitle')
      : $t('system.dict.addTitle');
    if (data.isEdit && data.record) {
      formApi.setValues({
        ...createDefaultDictForm(),
        ...data.record,
        status: data.record.status === 1,
      });
    } else {
      formApi.setValues({ ...createDefaultDictForm(), status: true });
    }
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = (await formApi.getValues()) as any;
    const data = drawerApi.getData<{
      isEdit: boolean;
      onSuccess?: () => void;
      record?: Partial<CreateOrUpdateDictReq>;
    }>();

    drawerApi.lock(true);
    try {
      const payload = { ...values, status: values.status ? 1 : 0 };

      if (data.isEdit && data.record?.ID) {
        await updateDictApi({ ...payload, ID: data.record.ID });
        message.success($t('system.message.updateSuccess'));
      } else {
        await createDictApi(payload);
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
