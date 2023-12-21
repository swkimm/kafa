import { Test, type TestingModule } from '@nestjs/testing'
import { PrismaService } from '@/prisma/prisma.service'
import type { AccountCredential } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { AccountCredentialService } from '../interface/account-credential.service.interface'
import { AccountCredentialServiceImpl } from '../service/account-credential.service'

describe('AccountCredentialService', () => {
  const mockAuthService = {}
  const db = {}

  let service: AccountCredentialService<AccountCredential>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'AccountCredentialService',
          useClass: AccountCredentialServiceImpl
        },
        {
          provide: 'AuthService',
          useValue: mockAuthService
        },
        {
          provide: PrismaService,
          useValue: db
        }
      ]
    }).compile()

    service = module.get<AccountCredentialService<AccountCredential>>(
      'AccountCredentialService'
    )

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).not.to.be.undefined
  })
})
