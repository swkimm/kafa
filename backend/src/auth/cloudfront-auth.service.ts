import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  type CloudfrontSignedCookiesOutput,
  getSignedCookies
} from '@aws-sdk/cloudfront-signer'
import type { CloudFrontAuthService } from './cloudfront-auth.service.interface'

@Injectable()
export class CloudFrontAuthServiceImpl implements CloudFrontAuthService {
  private readonly keyPairId: string
  private readonly privateKey: string

  constructor(private readonly config: ConfigService) {
    this.keyPairId = this.config.get('CLOUDFRONT_ID_KEY')
    this.privateKey = this.config.get('CLOUDFRONT_SECRET_KEY')

    if (this.config.get('NODE_ENV') === 'development') {
      this.privateKey = this.privateKey.replace(/\\n/g, '\n')
    }

    if (
      (!this.keyPairId || !this.privateKey) &&
      (this.config.get('NODE_ENV') === 'staging' ||
        this.config.get('NODE_ENV') === 'production')
    ) {
      throw new Error('CloudFront key pair ID or private key is not configured')
    }
  }

  issueCookies(resourceUrl: string): CloudfrontSignedCookiesOutput {
    const policy = JSON.stringify({
      Statement: [
        {
          Resource: resourceUrl,
          Condition: {
            DateLessThan: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'AWS:EpochTime': Math.floor(Date.now() / 1000) + 15 * 60
            }
          }
        }
      ]
    })

    return getSignedCookies({
      url: resourceUrl,
      keyPairId: this.keyPairId,
      privateKey: this.privateKey,
      policy
    })
  }
}
