import type { CloudfrontSignedCookiesOutput } from '@aws-sdk/cloudfront-signer'

/**
 * Cloud Front Signed Cookie 및 Signed Url과 관련된 서비스 인터페이스
 */
export interface CloudFrontAuthService {
  /**
   * CloudFront에 접근 제한된 리소스를 접근하기 위한 Signed Cookie를 발급합니다.
   *
   * @param {string} resourceUrl - 접근을 허용할 리소스의 url
   * @returns {CloudfrontSignedCookiesOutput} Cloudfront Sigend Cookie
   */
  issueCookies(resourceUrl: string): CloudfrontSignedCookiesOutput
}
