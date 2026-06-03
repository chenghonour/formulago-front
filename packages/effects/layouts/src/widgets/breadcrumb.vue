<script lang="ts" setup>
import type { BreadcrumbStyleType } from '@formulago/types';

import type { IBreadcrumb } from '@vben-core/shadcn-ui';

import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { preferences } from '@formulago/preferences';

import { VbenBreadcrumbView } from '@vben-core/shadcn-ui';

interface Props {
  hideWhenOnlyOne?: boolean;
  showHome?: boolean;
  showIcon?: boolean;
  type?: BreadcrumbStyleType;
}

const props = withDefaults(defineProps<Props>(), {
  showHome: false,
  showIcon: false,
  type: 'normal',
});

const route = useRoute();
const router = useRouter();

const breadcrumbs = ref<IBreadcrumb[]>([]);

function updateBreadcrumbs() {
  const matched = route.matched;
  const resultBreadcrumb: IBreadcrumb[] = [];

  for (const match of matched) {
    const { meta, path } = match;
    const { hideChildrenInMenu, hideInBreadcrumb, icon, title } =
      meta || {};
    if (hideInBreadcrumb || hideChildrenInMenu || !path) {
      continue;
    }

    const isEn = preferences.app.locale === 'en-US';
    resultBreadcrumb.push({
      icon,
      path: path || route.path,
      title: isEn && meta?.titleEn
        ? (meta.titleEn as string)
        : (title as string) || '',
    });
  }
  if (props.showHome) {
    resultBreadcrumb.unshift({
      icon: 'mdi:home-outline',
      isHome: true,
      path: '/',
    });
  }
  if (props.hideWhenOnlyOne && resultBreadcrumb.length === 1) {
    breadcrumbs.value = [];
    return;
  }

  breadcrumbs.value = resultBreadcrumb;
}

watch(
  [() => route.matched, () => preferences.app.locale],
  () => { updateBreadcrumbs(); },
  { immediate: true },
);

function handleSelect(path: string) {
  router.push(path);
}
</script>
<template>
  <VbenBreadcrumbView
    :breadcrumbs="breadcrumbs"
    :show-icon="showIcon"
    :style-type="type"
    class="ml-2"
    @select="handleSelect"
  />
</template>
