<script setup lang="ts">
import { ref } from 'vue';

import { message } from 'ant-design-vue';

import { deleteStructTagApi } from '#/api/system/tool';
import { $t } from '#/locales';

defineOptions({ name: 'DevtoolDeleteStructTag' });

const inputStr = ref('');
const outputStr = ref('');
const loading = ref(false);

async function handleDeleteStructTag() {
  if (!inputStr.value.trim()) {
    message.warning($t('devtool.struct.placeholder.input'));
    return;
  }
  loading.value = true;
  try {
    const result = await deleteStructTagApi({ structStr: inputStr.value });
    outputStr.value = result.structStr ?? '';
    if (outputStr.value) {
      message.success($t('devtool.struct.message.success'));
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function handleCopy() {
  if (!outputStr.value) return;
  navigator.clipboard.writeText(outputStr.value).then(() => {
    message.success($t('devtool.struct.message.copied'));
  });
}

function handleClear() {
  inputStr.value = '';
  outputStr.value = '';
}
</script>

<template>
  <Page auto-content-height>
    <div class="flex flex-col gap-4 p-6">
      <a-card :title="$t('devtool.struct.deleteTag.title')">
        <div class="grid grid-cols-2 gap-6">
          <!-- 左侧：输入 -->
          <div class="flex flex-col">
            <div class="mb-2 text-sm font-medium">
              {{ $t('devtool.struct.label.input') }}
            </div>
            <a-textarea
              v-model:value="inputStr"
              :placeholder="$t('devtool.struct.placeholder.input')"
              :rows="20"
              class="font-mono"
            />
          </div>

          <!-- 右侧：输出 -->
          <div class="flex flex-col">
            <div class="mb-2 text-sm font-medium">
              {{ $t('devtool.struct.label.output') }}
            </div>
            <a-textarea
              v-model:value="outputStr"
              :placeholder="$t('devtool.struct.placeholder.output')"
              :rows="20"
              class="font-mono"
              readonly
            />
          </div>
        </div>

        <div class="mt-4 flex gap-3">
          <a-button type="primary" :loading="loading" @click="handleDeleteStructTag">
            {{ $t('devtool.struct.deleteTag.action') }}
          </a-button>
          <a-button :disabled="!outputStr" @click="handleCopy">
            {{ $t('devtool.struct.action.copy') }}
          </a-button>
          <a-button @click="handleClear">
            {{ $t('devtool.struct.action.clear') }}
          </a-button>
        </div>
      </a-card>
    </div>
  </Page>
</template>
