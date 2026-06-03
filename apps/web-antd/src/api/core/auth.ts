import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
    captcha?: string;
    captchaId?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  const resp = await baseRequestClient.post<Record<string, any>>(
    '/login',
    data,
  );
  // JWT LoginHandler 返回 {code: 0, token: "...", expire: "..."}
  // baseRequestClient 为 raw 模式，resp 为 AxiosResponse，resp.data 为响应体
  const responseData = resp.data ?? resp;
  return { accessToken: responseData.token } as AuthApi.LoginResult;
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  const resp = await baseRequestClient.post<Record<string, any>>(
    '/refresh_token',
    { withCredentials: true },
  );
  return resp;
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/admin/user/perm');
}
