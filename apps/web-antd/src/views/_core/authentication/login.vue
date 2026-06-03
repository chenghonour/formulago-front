<script lang="ts" setup>
import type { VbenFormSchema } from '@formulago/common-ui';

import { computed, h, markRaw, onMounted, ref } from 'vue';

import { AuthenticationLogin, z } from '@formulago/common-ui';
import { $t } from '@formulago/locales';

import { useAuthStore } from '#/store';

import { captchaApi } from '#/api';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const captchaId = ref('');
const captchaImg = ref('');
const loadingCaptcha = ref(false);

async function loadCaptcha() {
  loadingCaptcha.value = true;
  try {
    const result = await captchaApi();
    captchaId.value = result.captchaID;
    captchaImg.value = result.imgPath;
  } finally {
    loadingCaptcha.value = false;
  }
}

onMounted(() => {
  loadCaptcha();
});

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.captchaPlaceholder'),
      },
      fieldName: 'captcha',
      label: $t('authentication.captcha'),
      rules: z.string().min(1, { message: $t('authentication.captchaTip') }),
    },
    {
      component: markRaw({
        render() {
          return h(
            'div',
            {
              class: 'captcha-wrapper',
              style: 'display:flex;align-items:center;gap:8px;cursor:pointer;',
              onClick: loadCaptcha,
            },
            captchaImg.value
              ? h('img', {
                  src: captchaImg.value,
                  alt: 'captcha',
                  style: 'height:36px;border-radius:4px;',
                })
              : h(
                  'span',
                  { style: 'font-size:12px;color:#999;' },
                  '加载验证码...',
                ),
          );
        },
      }),
      fieldName: '__captcha_image',
      label: '',
      rules: z.any().optional(),
    },
  ];
});

// 在提交时注入 captchaId
async function handleSubmit(formData: Record<string, any>) {
  await authStore.authLogin({
    ...formData,
    captchaId: captchaId.value,
  });
}
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="handleSubmit"
  />
</template>
