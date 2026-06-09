import type { ProtoResp, StructReq, StructResp } from './model/toolModel';

import { requestClient } from '#/api/request';

/**
 * 删除结构体标签 (去掉 struct tag)
 */
export async function deleteStructTagApi(params: StructReq) {
  return requestClient.post<StructResp>('/deleteStructTag', params);
}

/**
 * 转换 struct 至 proto 类型数据
 */
export async function structToProtoApi(params: StructReq) {
  return requestClient.post<ProtoResp>('/structToProto', params);
}
