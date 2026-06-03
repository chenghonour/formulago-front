import { defineConfig } from '@formulago/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      resolve: {
        alias: {
          vue: 'vue/dist/vue.esm-bundler.js',
        },
      },
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            // 后端 Formulago Go API 地址
            target: 'http://localhost:8191',
            ws: true,
          },
        },
      },
    },
  };
});
