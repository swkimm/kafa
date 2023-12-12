import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as path from 'path'
import type { EmailService } from './email.service.interface'

@Injectable()
export class EmailServiceImpl implements EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService
  ) {}

  async sendVerificationEmail(to: string, pin: string): Promise<void> {
    if (
      this.config.get('NODE_ENV') === 'staging' ||
      this.config.get('NODE_ENV') === 'production'
    ) {
      await this.mailerService.sendMail({
        to,
        subject: '[대한미식축구협회(KAFA)] 이메일 주소 인증',
        template: path.join(__dirname, 'templates/email-auth'),
        context: { pin },
        attachments: [
          {
            filename: 'logo.png',
            path: path.join(__dirname, 'templates/logo.png'),
            cid: 'logo'
          }
        ]
      })
    } else {
      return
    }
  }

  async sendTeamRegisterMail(
    to: string,
    username: string,
    password: string
  ): Promise<void> {
    if (
      this.config.get('NODE_ENV') === 'staging' ||
      this.config.get('NODE_ENV') === 'production'
    ) {
      await this.mailerService.sendMail({
        to,
        subject: '[대한미식축구협회(KAFA)] 팀 등록 승인 및 팀 계정 안내',
        template: path.join(__dirname, 'templates/register-team'),
        context: { username, password },
        attachments: [
          {
            filename: 'logo.png',
            path: path.join(__dirname, 'templates/logo.png'),
            cid: 'logo'
          }
        ]
      })
    } else {
      return
    }
  }
}
