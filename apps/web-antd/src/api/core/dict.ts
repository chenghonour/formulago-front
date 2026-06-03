import type {
  BackendDictionaryDetail,
  BackendDictionaryInfo,
  BackendPageReq,
  BackendPageResult,
} from '@formulago/types';

import { requestClient } from '#/api/request';

/** 字典查询参数 */
export interface DictListReq extends BackendPageReq {
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

/**
 * 获取字典列表
 */
export async function getDictListApi(params: DictListReq) {
  return requestClient.post<BackendPageResult<BackendDictionaryInfo>>(
    '/admin/dict/list',
    params,
  );
}

/**
 * 创建字典
 */
export async function createDictApi(data: CreateOrUpdateDictReq) {
  return requestClient.post('/admin/dict/create', data);
}

/**
 * 更新字典
 */
export async function updateDictApi(data: CreateOrUpdateDictReq) {
  return requestClient.post('/admin/dict/update', data);
}

/**
 * 删除字典
 */
export async function deleteDictApi(id: number) {
  return requestClient.delete('/admin/dict', { params: { ID: id } });
}

/**
 * 根据字典名称获取字典明细列表
 */
export async function getDictDetailListApi(name: string) {
  const result = await requestClient.post<BackendDictionaryDetail[]>(
    '/admin/dict/detail/list',
    { name },
  );
  return Array.isArray(result) ? result : [];
}

/**
 * 创建字典明细
 */
export async function createDictDetailApi(data: CreateOrUpdateDictDetailReq) {
  return requestClient.post('/admin/dict/detail/create', data);
}

/**
 * 更新字典明细
 */
export async function updateDictDetailApi(data: CreateOrUpdateDictDetailReq) {
  return requestClient.post('/admin/dict/detail/update', data);
}

/**
 * 删除字典明细
 */
export async function deleteDictDetailApi(id: number) {
  return requestClient.delete('/admin/dict/detail', {
    params: { ID: id },
  });
}
