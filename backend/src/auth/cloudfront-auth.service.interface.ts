import type { CloudfrontSignedCookiesOutput } from '@aws-sdk/cloudfront-signer'

export interface CloudFrontAuthService {
  issueCookies(resourceUrl: string): CloudfrontSignedCookiesOutput
}
