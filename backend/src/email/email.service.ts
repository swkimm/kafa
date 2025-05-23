import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import * as path from 'path'
import type { EmailService } from './email.service.interface'

@Injectable()
export class EmailServiceImpl implements EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(to: string, pin: string): Promise<void> {
    const currentYear = new Date().getFullYear()
    await this.mailerService.sendMail({
      to,
      subject: '[대한미식축구협회(KAFA)] 이메일 주소 인증',
      template: path.join(__dirname, 'templates/email-auth.hbs'),
      context: { pin, currentYear },
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(__dirname, 'templates/logo.png'),
          cid: 'logo'
        }
      ]
    })
  }

  async sendTeamRegisterMail(
    to: string,
    username: string,
    password: string
  ): Promise<void> {
    const currentYear = new Date().getFullYear()

    await this.mailerService.sendMail({
      to,
      subject: '[대한미식축구협회(KAFA)] 팀 등록 승인 및 팀 계정 안내',
      template: path.join(__dirname, 'templates/register-team.hbs'),
      context: { username, password, currentYear },
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(__dirname, 'templates/logo.png'),
          cid: 'logo'
        }
      ]
    })
  }
}
