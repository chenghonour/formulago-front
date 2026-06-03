import { createApp, watchEffect } from 'vue';

import { registerAccessDirective } from '@formulago/access';
import { registerLoadingDirective } from '@formulago/common-ui/es/loading';
import { preferences } from '@formulago/preferences';
import { initStores } from '@formulago/stores';
import '@formulago/styles';
import '@formulago/styles/antd';

import { useTitle } from '@vueuse/core';

import Antd from 'ant-design-vue';

import { setupI18n } from '#/locales';

import { initComponentAdapter } from './adapter/component';
import { initSetupVbenForm } from './adapter/form';
import App from './app.vue';
import { router } from './router';

async function bootstrap(namespace: string) {
  // 初始化组件适配器
  await initComponentAdapter();

  // 初始化表单组件
  await initSetupVbenForm();

  // // 设置弹窗的默认配置
  // setDefaultModalProps({
  //   fullscreenButton: false,
  // });
  // // 设置抽屉的默认配置
  // setDefaultDrawerProps({
  //   zIndex: 1020,
  // });

  const app = createApp(App);

  // 注册v-loading指令
  registerLoadingDirective(app, {
    loading: 'loading', // 在这里可以自定义指令名称，也可以明确提供false表示不注册这个指令
    spinning: 'spinning',
  });

  // 国际化 i18n 配置
  await setupI18n(app);

  // 配置 pinia-tore
  await initStores(app, { namespace });

  // 安装权限指令
  registerAccessDirective(app);

  // 初始化 tippy
  const { initTippy } = await import('@formulago/common-ui/es/tippy');
  initTippy(app);

  // 注册全局 Ant Design Vue 组件
  app.use(Antd);

  // 配置路由及路由守卫
  app.use(router);

  // 配置Motion插件
  const { MotionPlugin } = await import('@formulago/plugins/motion');
  app.use(MotionPlugin);

  // 动态更新标题
  watchEffect(() => {
    if (preferences.app.dynamicTitle) {
      const meta = router.currentRoute.value.meta;
      const routeTitle =
        preferences.app.locale === 'en-US' && meta?.titleEn
          ? (meta.titleEn as string)
          : (meta?.title as string);
      const pageTitle =
        (routeTitle ? `${routeTitle} - ` : '') + preferences.app.name;
      useTitle(pageTitle);
    }
  });

  app.mount('#app');
}

export { bootstrap };
