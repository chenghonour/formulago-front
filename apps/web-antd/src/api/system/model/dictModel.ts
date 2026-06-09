import type { BasePageReq } from "#/api/model/baseModel";

/** 后端字典信息 */
export interface DictionaryInfo {
  ID: number;
  title: string;
  name: string;
  status: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/** 后端字典明细 */
export interface DictionaryDetail {
  ID: number;
  title: string;
  key: string;
  value: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  parentID: number;
}

/** 字典查询参数 */
export interface DictListReq extends BasePageReq {
  title?: string;
  name?: string;
}

/** 字典创建/更新请求 */
export interface CreateOrUpdateDictReq {
  ID?: number;
  title?: string;
  name?: string;
  status?: number;
  description?: string;
}

/** 字典明细创建/更新请求 */
export interface CreateOrUpdateDictDetailReq {
  ID?: number;
  title?: string;
  key?: string;
  value?: string;
  status?: number;
  parentID?: number;
}

/** 字典列表响应 */
export interface DictionaryListResp {
  errCode?: number;
  errMsg?: string;
  total?: number;
  data?: DictionaryInfo[];
}

/** 字典明细列表响应 */
export interface DictionaryDetailListResp {
  errCode?: number;
  errMsg?: string;
  total?: number;
  data?: DictionaryDetail[];
}
