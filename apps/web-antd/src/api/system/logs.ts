import type { LogsListReq, LogsListResp } from './model/logModel';

import { requestClient } from '#/api/request';

/**
 * 获取操作日志列表
 */
export async function getLogsListApi(params: LogsListReq) {
  return requestClient.post<LogsListResp>('/admin/logs/list', params);
}

/**
 * 清空操作日志
 */
export async function deleteAllLogsApi() {
  return requestClient.delete('/admin/logs/deleteAll');
}
