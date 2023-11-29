import { MailerService } from '@nestjs-modules/mailer'
import { Test, type TestingModule } from '@nestjs/testing'
import { expect } from 'chai'
import * as sinon from 'sinon'
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
    sendMail: sinon.stub()
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

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).to.be.ok
  })

  it('email transmission success', async () => {
    // given
    MailerMock.sendMail.resolves(expectedEmailInfo)

    // when
    await service.sendVerificationEmail(recipient, 'PIN')

    // then
    expect(MailerMock.sendMail.calledOnce).to.be.true
  })

  it('email transmission success', async () => {
    // given
    const username = 'username'
    const password = 'password'
    MailerMock.sendMail.resolves(expectedEmailInfo)

    // when
    await service.sendTeamRegisterMail(recipient, username, password)

    // then
    expect(MailerMock.sendMail.calledOnce).to.be.true
    expect(
      MailerMock.sendMail.calledWithMatch({
        to: recipient,
        context: { username, password }
      })
    ).to.be.true
  })
})
