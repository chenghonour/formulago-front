import { requestClient } from '#/api/request';

/**
 * 获取登录验证码
 */
export async function captchaApi() {
  return requestClient.get<{ captchaID: string; imgPath: string }>(
    '/captcha',
  );
}
