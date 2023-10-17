import { Test, type TestingModule } from '@nestjs/testing'
import { type Account, Role, AccountStatus } from '@prisma/client'
import { expect } from 'chai'
import { stub } from 'sinon'
import { PrismaService } from 'src/prisma/prisma.service'
import { AccountService } from './account.service'

describe('AccountService', () => {
  let service: AccountService

  const VALID_PASSWORD = 'password'

  const db = {
    account: {
      update: stub(),
      findUnique: stub()
    }
  }

  const user: Account = {
    id: 1,
    status: AccountStatus.Enable,
    createdAt: new Date(),
    lastLogin: new Date(),
    password: VALID_PASSWORD,
    role: Role.User,
    username: 'user01',
    email: 'example@example.com',
    lastPasswordChanged: new Date(),
    name: 'user01',
    profileImgUrl: undefined,
    deletedAt: undefined
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService, { provide: PrismaService, useValue: db }]
    }).compile()

    service = module.get<AccountService>(AccountService)
  })

  it('should be defined', () => {
    expect(service).to.be.not.undefined
  })

  describe('updateLastLogin', () => {
    it('should update lastLogin field', async () => {
      //given
      db.account.update.resolves()

      //when
      await service.updateLastLogin(user.username)

      //then
      expect(
        db.account.update.calledOnceWith({
          where: {
            username: user.username
          },
          data: {
            lastLogin: new Date()
          }
        })
      ).to.be.true
    })
  })

  describe('getUserCredential', async () => {
    it('should return account', async () => {
      //given
      db.account.findUnique.resolves(user)

      //when
      const result = await service.getUserCredential(user.username)

      //then
      expect(result).to.be.deep.equal(user)
    })
  })
})
