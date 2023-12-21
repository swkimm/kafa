import { Test, type TestingModule } from '@nestjs/testing'
import { PrismaService } from '@/prisma/prisma.service'
import type { AccountCertification } from '@prisma/client'
import { expect } from 'chai'
import * as sinon from 'sinon'
import type { AccountCertificationService } from '../interface/account-certification.service.interface'
import { AccountCertificationServiceImpl } from '../service/account-certification.service'

describe('AccountCertificationService', () => {
  const mockAuthService = {}
  const db = {}
  const mockFileStorageService = {
    uploadObject: sinon.stub(),
    deleteObject: sinon.stub()
  }

  let service: AccountCertificationService<AccountCertification>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'AccountCertificationService',
          useClass: AccountCertificationServiceImpl
        },
        {
          provide: 'AuthService',
          useValue: mockAuthService
        },
        {
          provide: PrismaService,
          useValue: db
        },
        {
          provide: 'FileStorageService',
          useValue: mockFileStorageService
        }
      ]
    }).compile()

    service = module.get<AccountCertificationService<AccountCertification>>(
      'AccountCertificationService'
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
