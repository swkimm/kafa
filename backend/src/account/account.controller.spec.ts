import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Test, type TestingModule } from '@nestjs/testing'
import { EmailAuthServiceImpl } from '@/auth/email-auth.service'
import { expect } from 'chai'
import { PrismaService } from 'src/prisma/prisma.service'
import { AccountController } from './account.controller'
import { AccountServiceImpl } from './account.service'

describe('AccountController', () => {
  let controller: AccountController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        { provide: 'AccountService', useClass: AccountServiceImpl },
        { provide: 'EmailAuthService', useClass: EmailAuthServiceImpl },
        { provide: PrismaService, useValue: {} },
        {
          provide: CACHE_MANAGER,
          useFactory: () => ({
            set: () => [],
            get: () => [],
            del: () => []
          })
        },
        { provide: 'EmailService', useValue: {} },
        { provide: 'AuthService', useValue: {} }
      ]
    }).compile()

    controller = module.get<AccountController>(AccountController)
  })

  it('should be defined', () => {
    expect(controller).to.be.not.undefined
  })
})
