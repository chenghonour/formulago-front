<script setup lang="ts">
import type { RoleInfo } from '#/api/system/model/roleModel';
import type { BackendUserInfo } from '#/api/system/model/userModel';

import { ref } from 'vue';

import { useVbenDrawer } from '@formulago/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getRoleListApi } from '#/api/system/role';
import { createUserApi, updateUserApi } from '#/api/system/user';
import { $t } from '#/locales';

import { createDefaultForm, userFormSchemas } from './user.data';

const drawerTitle = ref('');
const roleOptions = ref<{ label: string; value: number }[]>([]);

const [Form, formApi] = useVbenForm({
  schema: userFormSchemas,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-3',
});

const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-100',
  onOpened() {
    const data = drawerApi.getData<{
      isEdit: boolean;
      onSuccess?: () => void;
      record?: Partial<BackendUserInfo>;
    }>();

    drawerTitle.value = data.isEdit
      ? $t('system.user.editTitle')
      : $t('system.user.addTitle');

    // 加载角色列表供下拉选择
    loadRoleOptions();

    if (data.isEdit && data.record) {
      formApi.setValues({
        ...createDefaultForm(),
        ...data.record,
        password: '', // 编辑时清空密码，不修改则留空
        status: data.record.status === 1,
      });
    } else {
      formApi.setValues({ ...createDefaultForm(), status: true });
    }
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    const values = (await formApi.getValues()) as any;
    const data = drawerApi.getData<{
      isEdit: boolean;
      onSuccess?: () => void;
      record?: Partial<BackendUserInfo>;
    }>();

    drawerApi.lock(true);
    try {
      // 转为后端使用的数字状态
      const payload = {
        ...values,
        status: values.status ? 1 : 0,
      };
      // 编辑时密码为空表示不修改密码
      if (data.isEdit && !payload.password) {
        delete payload.password;
      }

      if (data.isEdit && data.record?.ID) {
        await updateUserApi({ ...payload, ID: data.record.ID });
        message.success($t('system.message.updateSuccess'));
      } else {
        await createUserApi(payload);
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

/** 加载角色列表 */
async function loadRoleOptions() {
  try {
    const result = await getRoleListApi({ page: 1, pageSize: 999 });
    const roles = result.data ?? [];
    roleOptions.value = roles.map((r: RoleInfo) => ({
      label: r.name,
      value: r.ID,
    }));
    formApi.updateSchema([{
      fieldName: 'roleID',
      componentProps: { options: roleOptions.value },
    }]);
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <Drawer :title="drawerTitle">
    <Form />
  </Drawer>
</template>
