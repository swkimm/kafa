import { MailerService } from '@nestjs-modules/mailer'
import { Test, type TestingModule } from '@nestjs/testing'
import { expect } from 'chai'
import { stub } from 'sinon'
import { EmailServiceImpl } from './email.service'
import type { EmailService } from './email.service.interface'

describe('EmailService', () => {
  let service: EmailService

  let recipient: string
  let expectedEmailInfo: {
    accepted: string[]
    rejected: string[]
    envelopeTime: number
    messageTime: number
    messageSize: number
    response: string
    envelope: { from: string; to: string[] }
    messageId: string
  }

  const MailerMock = {
    sendMail: stub()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'EmailService', useClass: EmailServiceImpl },
        { provide: MailerService, useValue: MailerMock }
      ]
    }).compile()

    service = module.get<EmailService>('EmailService')

    recipient = 'abc@abc.com'

    expectedEmailInfo = {
      accepted: [recipient],
      rejected: [],
      envelopeTime: 715,
      messageTime: 590,
      messageSize: 473,
      response:
        '250 2.0.0 OK  1658043820 q93-56600b001f061359022sm8791552pjk.54 - gsmtp',
      envelope: { from: 'sender@gmail.com', to: [recipient] },
      messageId: '6bd7-3d62-c84b-61865f06534b@gmail.com'
    }
  })

  it('should be defined', () => {
    expect(service).to.be.ok
  })

  it('Email transmission success', async () => {
    MailerMock.sendMail.resolves(expectedEmailInfo)
    await service.sendVerificationEmail(recipient, 'PIN')

    expect(MailerMock.sendMail.calledOnce).to.be.true
  })
})
