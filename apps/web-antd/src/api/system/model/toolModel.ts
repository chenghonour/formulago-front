/** 结构体请求参数 */
export interface StructReq {
  structStr: string;
}

/** 结构体响应 */
export interface StructResp {
  errCode?: number;
  errMsg?: string;
  structStr?: string;
}

/** Proto 响应 */
export interface ProtoResp {
  errCode?: number;
  errMsg?: string;
  protoStr?: string;
}
