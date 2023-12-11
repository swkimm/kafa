import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject } from '@nestjs/common'
import { emailVerificationCacheKey } from '@/common/cache/cache-keys'
import { EMAIL_VERIFICATION_PIN_EXPIRE_TIME } from '@/common/constant/time.constants'
import {
  CacheException,
  EmptyParameterException
} from '@/common/exception/business.exception'
import { EmailService } from '@/email/email.service.interface'
import { Cache } from 'cache-manager'
import type { PinAuthService } from './pin-auth.service.interface'

export class EmailAuthServiceImpl implements PinAuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @Inject('EmailService') private readonly emailService: EmailService
  ) {}

  async verifyPin(accountId: number, code: string): Promise<boolean> {
    if (!code) {
      throw new EmptyParameterException('pin code')
    }

    try {
      const pin = await this.cache.get(emailVerificationCacheKey(accountId))
      return pin === code
    } catch (error) {
      throw new CacheException(error)
    }
  }

  async registerPin(
    accountId: number,
    email: string
  ): Promise<{ result: string }> {
    try {
      const pin = this.generatePin()

      await this.sendPin(email, pin)

      await this.cache.set(
        emailVerificationCacheKey(accountId),
        pin,
        EMAIL_VERIFICATION_PIN_EXPIRE_TIME
      )

      return { result: 'ok' }
    } catch (error) {
      throw new CacheException(error)
    }
  }

  async deletePin(accountId: number): Promise<{ result: string }> {
    try {
      await this.cache.del(emailVerificationCacheKey(accountId))

      return { result: 'ok' }
    } catch (error) {
      throw new CacheException(error)
    }
  }

  private async sendPin(email: string, pin: string): Promise<void> {
    await this.emailService.sendVerificationEmail(email, pin)
  }

  private generatePin(): string {
    let pin = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < 6; i++) {
      pin += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return pin
  }
}
