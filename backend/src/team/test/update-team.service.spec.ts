import { Test, type TestingModule } from '@nestjs/testing'
import {
  ConflictFoundException,
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import {
  type Team,
  Prisma,
  TeamStatus,
  type RegisterTeamRequest,
  TeamEnrollStatus,
  type Account,
  AccountStatus,
  Role
} from '@prisma/client'
import { expect } from 'chai'
import { plainToClass } from 'class-transformer'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import { RegisterTeamDTO } from '../dto/register-team.dto'
import type { UpdateTeamDTO } from '../dto/update-team.dto'
import type { UpdateTeamService } from '../interface/update-team.service.interface'
import { UpdateTeamServiceImpl } from '../service/update-team.service'

describe('UpdateTeamService', () => {
  const db = {
    team: {
      update: sinon.stub()
    },
    registerTeamRequest: {
      findUniqueOrThrow: sinon.stub(),
      update: sinon.stub()
    }
  }

  const mockAccountService = {
    getAccountProfile: sinon.stub(),
    registerAccount: sinon.stub(),
    mappingManagerAccount: sinon.stub()
  }

  const mockEmailService = {
    sendTeamRegisterMail: sinon.stub()
  }

  const mockRegisterTeamService = {
    registerTeam: sinon.stub()
  }

  const team: Team = {
    id: 1,
    associationId: 1,
    backgroundImgUrl: '',
    color: '#123456',
    establishedAt: new Date('2023-01-01'),
    globalName: 'team01',
    hometown: 'abc',
    initial: 'team01',
    name: 'team01',
    profileImgUrl: '',
    status: TeamStatus.Enabled,
    subColor: '#123456',
    deletedAt: undefined,
    createdAt: new Date('2023-01-01')
  }

  const registerTeamRequest: RegisterTeamRequest = {
    id: 1,
    accountId: 1,
    createdAt: new Date('2023-01-01'),
    data: {
      associationId: 1,
      name: team.name,
      color: team.color,
      establishedAt: team.establishedAt.toString(),
      globalName: team.globalName,
      hometown: team.hometown,
      initial: team.initial,
      subColor: team.subColor
    },
    rejectReason: '',
    status: TeamEnrollStatus.Received,
    username: 'team01'
  }

  const rejectedRegisterTeamRequest: RegisterTeamRequest = {
    id: 1,
    accountId: 1,
    createdAt: new Date('2023-01-01'),
    data: {
      associationId: 1,
      name: team.name,
      color: team.color,
      establishedAt: team.establishedAt.toString(),
      globalName: team.globalName,
      hometown: team.hometown,
      initial: team.initial,
      subColor: team.subColor
    },
    rejectReason: '',
    status: TeamEnrollStatus.Rejected,
    username: 'team01'
  }

  const account: Account = {
    id: 1,
    status: AccountStatus.Enable,
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date('2023-01-01'),
    password: 'password',
    role: Role.User,
    username: 'user01',
    email: 'example@example.com',
    lastPasswordChanged: new Date('2023-01-01'),
    name: 'user01',
    profileImgUrl: undefined,
    deletedAt: undefined,
    teamId: undefined
  }

  let service: UpdateTeamService<Team, RegisterTeamRequest>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UpdateTeamService',
          useClass: UpdateTeamServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        },
        { provide: 'AccountService', useValue: mockAccountService },
        {
          provide: 'EmailService',
          useValue: mockEmailService
        },
        {
          provide: 'RegisterTeamService',
          useValue: mockRegisterTeamService
        }
      ]
    }).compile()

    service =
      module.get<UpdateTeamService<Team, RegisterTeamRequest>>(
        'UpdateTeamService'
      )

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).to.be.ok
  })

  describe('updateTeamProfile', () => {
    it('should return result ok', async () => {
      // given
      const teamId = 1
      const teamDTO: UpdateTeamDTO = {
        name: team.name,
        color: team.color,
        establishedAt: team.establishedAt,
        globalName: team.globalName,
        hometown: team.hometown,
        initial: team.initial,
        subColor: team.subColor
      }
      db.team.update.resolves(team)

      // when
      const result = await service.updateTeamProfile(teamDTO, teamId)

      // then
      expect(result).to.be.deep.equal(team)
      expect(
        db.team.update.calledOnceWith({
          where: {
            id: teamId
          },
          data: {
            ...teamDTO
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid teamId passed', async () => {
      // given
      const teamId = 1
      const teamDTO: UpdateTeamDTO = {
        name: team.name,
        color: team.color,
        establishedAt: team.establishedAt,
        globalName: team.globalName,
        hometown: team.hometown,
        initial: team.initial,
        subColor: team.subColor
      }
      db.team.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          code: 'P2025',
          clientVersion: '1.0.0'
        })
      )

      // then
      await expect(
        service.updateTeamProfile(teamDTO, teamId)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw UnexpectedException', async () => {
      // given
      const teamId = 1
      const teamDTO: UpdateTeamDTO = {
        name: team.name,
        color: team.color,
        establishedAt: team.establishedAt,
        globalName: team.globalName,
        hometown: team.hometown,
        initial: team.initial,
        subColor: team.subColor
      }
      db.team.update.rejects(new Error('test'))

      // then
      await expect(
        service.updateTeamProfile(teamDTO, teamId)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })

  describe('approveRegisterTeamRequest', () => {
    it('should return approved team', async () => {
      // given
      const requestId = 1
      db.registerTeamRequest.findUniqueOrThrow.resolves(registerTeamRequest)
      db.registerTeamRequest.update.resolves()
      mockAccountService.getAccountProfile.resolves(account)
      mockAccountService.registerAccount.resolves(account)
      mockRegisterTeamService.registerTeam.resolves(team)

      // when
      const result = await service.approveRegisterTeamRequest(requestId)

      // then
      expect(result).to.be.deep.equal(team)
      expect(
        db.registerTeamRequest.findUniqueOrThrow.calledOnceWith({
          where: {
            id: requestId
          }
        })
      ).to.be.true
      expect(mockAccountService.getAccountProfile.calledOnceWith(account.id)).to
        .be.true
      expect(mockAccountService.registerAccount.calledOnce).to.be.true
      expect(
        mockAccountService.registerAccount.calledWithMatch(
          {
            name: registerTeamRequest.username,
            email: account.email,
            username: registerTeamRequest.username
          },
          Role.Manager
        )
      ).to.be.true
      expect(
        mockRegisterTeamService.registerTeam.calledOnceWith(
          plainToClass(RegisterTeamDTO, registerTeamRequest.data)
        )
      ).to.be.true
      expect(mockEmailService.sendTeamRegisterMail.calledOnce).to.be.true
      expect(
        mockEmailService.sendTeamRegisterMail.calledWithMatch(
          account.email,
          registerTeamRequest.username
        )
      ).to.be.true
      expect(
        mockAccountService.mappingManagerAccount.calledOnceWith(
          account.id,
          team.id
        )
      ).to.be.true
      expect(
        db.registerTeamRequest.update.calledOnceWith({
          where: {
            id: requestId
          },
          data: {
            status: TeamEnrollStatus.Approved
          }
        })
      ).to.be.true
    })

    it('should throw ConflictFoundException when registerTeamRequest is already processed', async () => {
      // given
      const requestId = 1
      db.registerTeamRequest.findUniqueOrThrow.resolves(
        rejectedRegisterTeamRequest
      )

      // then
      await expect(
        service.approveRegisterTeamRequest(requestId)
      ).to.be.rejectedWith(ConflictFoundException)
    })

    it('should throw EntityNotExistException when registerTeamRequestId is invalid', async () => {
      // given
      const requestId = 1
      db.registerTeamRequest.findUniqueOrThrow.resolves(registerTeamRequest)
      db.registerTeamRequest.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )
      mockAccountService.getAccountProfile.resolves(account)
      mockAccountService.registerAccount.resolves(account)
      mockRegisterTeamService.registerTeam.resolves(team)

      // then
      await expect(
        service.approveRegisterTeamRequest(requestId)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should pass error when exception is instanceof BusinessException', async () => {
      // given
      const requestId = 1
      db.registerTeamRequest.findUniqueOrThrow.resolves(registerTeamRequest)
      mockAccountService.getAccountProfile.rejects(
        new EntityNotExistException('test')
      )

      // then
      await expect(
        service.approveRegisterTeamRequest(requestId)
      ).to.be.rejectedWith(EntityNotExistException)
    })
  })

  describe('rejectRegisterTeamRequest', () => {
    it('should return rejectedRegisterTeamRequest', async () => {
      // given
      const requestId = 1
      const reason = 'test'
      db.registerTeamRequest.update.resolves(rejectedRegisterTeamRequest)

      // when
      const result = await service.rejectRegisterTeamRequest(requestId, reason)

      // then
      expect(result).to.be.deep.equal(rejectedRegisterTeamRequest)
      expect(
        db.registerTeamRequest.update.calledOnceWith({
          where: { id: requestId },
          data: {
            status: TeamEnrollStatus.Rejected,
            rejectReason: reason
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when Invalid requestId passed', async () => {
      // given
      const requestId = 1
      const reason = 'test'
      db.registerTeamRequest.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // when
      await expect(
        service.rejectRegisterTeamRequest(requestId, reason)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const requestId = 1
      const reason = 'test'
      db.registerTeamRequest.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1001'
        })
      )

      // when
      await expect(
        service.rejectRegisterTeamRequest(requestId, reason)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })
})
