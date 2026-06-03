<script lang="ts" setup>
import { AuthenticationQrCodeLogin } from '@formulago/common-ui';
import { LOGIN_PATH } from '@formulago/constants';

defineOptions({ name: 'QrCodeLogin' });
</script>

<template>
  <AuthenticationQrCodeLogin :login-path="LOGIN_PATH" />
</template>
