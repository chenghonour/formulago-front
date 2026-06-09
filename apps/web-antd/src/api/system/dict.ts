import type { BaseIdReq } from '../model/baseModel';
import type {
  CreateOrUpdateDictDetailReq,
  CreateOrUpdateDictReq,
  DictionaryDetailListResp,
  DictionaryListResp,
  DictListReq,
} from './model/dictModel';

import { requestClient } from '#/api/request';

/**
 * 获取字典列表
 */
export async function getDictListApi(params: DictListReq) {
  return requestClient.post<DictionaryListResp>(
    '/admin/dict/list',
    params,
  );
}

/**
 * 创建字典
 */
export async function createDictApi(params: CreateOrUpdateDictReq) {
  return requestClient.post('/admin/dict/create', params);
}

/**
 * 更新字典
 */
export async function updateDictApi(params: CreateOrUpdateDictReq) {
  return requestClient.post('/admin/dict/update', params);
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
  return requestClient.post<DictionaryDetailListResp>(
    '/admin/dict/detail/list',
    { name },
  );
}

/**
 * 创建字典明细
 */
export async function createDictDetailApi(params: CreateOrUpdateDictDetailReq) {
  return requestClient.post('/admin/dict/detail/create', params);
}

/**
 * 更新字典明细
 */
export async function updateDictDetailApi(params: CreateOrUpdateDictDetailReq) {
  return requestClient.post('/admin/dict/detail/update', params);
}

/**
 * 删除字典明细
 */
export async function deleteDictDetailApi(params: BaseIdReq) {
  return requestClient.delete('/admin/dict/detail', {
    params,
  });
}
