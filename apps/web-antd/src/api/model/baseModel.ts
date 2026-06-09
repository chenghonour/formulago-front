export interface BasePageReq {
  page?: number;
  pageSize?: number;
}

export interface BaseListResp<T> {
  // map(arg0: (item: any) => any): any[];
  forEach(arg0: (item: any) => void): unknown;
  filter(arg0: (item: any) => any): unknown;
  length: number;
  data: T[];
  total: number;
}

export interface BaseDataResp<T> {
  errCode: number;
  errMsg: string;
  total: number;
  data: T;
}

export interface BaseResp {
  errCode?: number;
  errMsg: string;
}

export interface BaseRespStr<T> {
  errCode?: number;
  errMsg: string;
  protoStr: T;
  structStr: T;
}

export interface BaseIdReq {
  ID: number;
}

export interface BaseIdsReq {
  ID: number[];
}

export interface DeleteFileReq {
  ID: number;
  filePath: string;
}
