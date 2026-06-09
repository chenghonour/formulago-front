<script setup lang="ts">
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getLogsListApi } from '#/api/system/logs';
import { $t } from '#/locales';

import { logsColumns, logsSearchSchemas } from './logs.data';

defineOptions({ name: 'LogsManagement' });

const [Grid] = useVbenVxeGrid({
  formOptions: {
    schema: logsSearchSchemas,
  },
  gridOptions: {
    columns: logsColumns,
    proxyConfig: {
      ajax: {
        query: async (params: any, customValues: any) => {
          const f = customValues ?? {};
          const result = await getLogsListApi({
            page: params.page,
            pageSize: params.pageSize,
            api: f.api || '',
            operator: f.operator || '',
            method: f.method || '',
            success:
              f.success === '' || f.success === undefined
                ? undefined
                : f.success === 'true',
          });
          return { items: result.data, total: result.total };
        },
      },
    },
    toolbarConfig: {
      refresh: true,
      zoom: true,
      search: true,
    },
    height: 'auto',
    scrollY: {
      enabled: true,
      gt: 0,
    },
  },
});

</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #successSlot="{ row }">
        <span :class="row.success ? 'text-green-500' : 'text-red-500'">
          {{ row.success ? $t('system.status.success') : $t('system.status.fail') }}
        </span>
      </template>
    </Grid>
  </Page>
</template>
