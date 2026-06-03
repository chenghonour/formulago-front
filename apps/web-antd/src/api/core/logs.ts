import type { BackendLogsInfo, BackendPageResult } from '@formulago/types';

import { requestClient } from '#/api/request';

/** 日志查询参数 */
export interface LogsListReq {
  page: number;
  pageSize: number;
  type?: string;
  method?: string;
  api?: string;
  success?: boolean;
  operator?: string;
}

/**
 * 获取操作日志列表
 */
export async function getLogsListApi(params: LogsListReq) {
  return requestClient.post<BackendPageResult<BackendLogsInfo>>(
    '/admin/logs/list',
    params,
  );
}

/**
 * 清空操作日志
 */
export async function deleteAllLogsApi() {
  return requestClient.delete('/admin/logs/deleteAll');
}
