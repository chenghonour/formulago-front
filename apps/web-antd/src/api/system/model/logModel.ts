/** 后端操作日志 */
export interface LogsInfo {
  type: string;
  method: string;
  api: string;
  success: boolean;
  reqContent: string;
  respContent: string;
  ip: string;
  userAgent: string;
  operator: string;
  time: string;
  createdAt: string;
  updatedAt: string;
}

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

/** 日志列表响应 */
export interface LogsListResp {
  errCode?: number;
  errMsg?: string;
  total?: number;
  data?: LogsInfo[];
}
