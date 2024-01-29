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
  TeamEnrollStatus
} from '@prisma/client'
import { expect } from 'chai'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import type { RegisterTeamRequestDTO } from '../dto/register-team-request.dto'
import type { RegisterTeamDTO } from '../dto/register-team.dto'
import type { RegisterTeamService } from '../interface/register-team.service.interface'
import { RegisterTeamServiceImpl } from '../service/register-team.service'

describe('RegisterTeamService', () => {
  const db = {
    team: {
      create: sinon.stub()
    },
    registerTeamRequest: {
      findFirst: sinon.stub(),
      create: sinon.stub()
    }
  }

  const team: Team = {
    id: 1,
    associationId: 1,
    backgroundImgUrl: '',
    color: '#123456',
    establishedAt: new Date('2023-01-01'),
    globalName: 'team',
    hometown: 'abc',
    message: '',
    initial: 'team',
    name: 'team01',
    profileImgUrl: '',
    status: TeamStatus.Enabled,
    subColor: '#123456',
    deletedAt: undefined,
    createdAt: new Date()
  }

  const mockAccountService = {
    isVerifiedAccount: sinon.stub(),
    isAccountExist: sinon.stub(),
    isEmailExist: sinon.stub(),
    getAccountProfile: sinon.stub()
  }

  const mockAssociationService = {
    getAssociation: sinon.stub()
  }

  let service: RegisterTeamService<Team, RegisterTeamRequest>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'RegisterTeamService',
          useClass: RegisterTeamServiceImpl
        },
        { provide: 'AccountService', useValue: mockAccountService },
        {
          provide: PrismaService,
          useValue: db
        },
        {
          provide: 'AssociationService',
          useValue: mockAssociationService
        }
      ]
    }).compile()

    service = module.get<RegisterTeamService<Team, RegisterTeamRequest>>(
      'RegisterTeamService'
    )

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).to.be.ok
  })

  describe('registerTeam', () => {
    it('should return registered team', async () => {
      // given
      const teamDTO: RegisterTeamDTO = {
        name: team.name,
        associationId: team.associationId,
        color: team.color,
        establishedAt: team.establishedAt,
        globalName: team.globalName,
        hometown: team.hometown,
        initial: team.initial,
        subColor: team.subColor
      }
      db.team.create.resolves(team)

      // when
      const result = await service.registerTeam(teamDTO)

      // then
      expect(result).to.be.deep.equal(team)
      expect(
        db.team.create.calledOnceWith({
          data: {
            ...teamDTO
          }
        })
      ).to.be.true
    })

    it('should return EntityNotExistException when invalid associationId passed', async () => {
      // given
      const teamDTO: RegisterTeamDTO = {
        name: team.name,
        associationId: team.associationId,
        color: team.color,
        establishedAt: team.establishedAt,
        globalName: team.globalName,
        hometown: team.hometown,
        initial: team.initial,
        subColor: team.subColor
      }
      db.team.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          code: 'P2003',
          clientVersion: '1.0.0'
        })
      )

      // then
      await expect(service.registerTeam(teamDTO)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should return UnexpectedException when database throws unexpected error', async () => {
      // given
      const teamDTO: RegisterTeamDTO = {
        name: team.name,
        associationId: team.associationId,
        color: team.color,
        establishedAt: team.establishedAt,
        globalName: team.globalName,
        hometown: team.hometown,
        initial: team.initial,
        subColor: team.subColor
      }
      db.team.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          code: 'P2001',
          clientVersion: '1.0.0'
        })
      )

      // then
      await expect(service.registerTeam(teamDTO)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })

  describe('createRegisterTeamRequest', () => {
    it('should return register team request', async () => {
      // given
      const email = 'test@example.com'
      const returnValue: RegisterTeamRequest = {
        accountId: 1,
        createdAt: new Date('2023-01-01'),
        data: JSON.stringify({
          name: team.name,
          associationId: team.associationId,
          color: team.color,
          establishedAt: team.establishedAt,
          globalName: team.globalName,
          hometown: team.hometown,
          initial: team.initial,
          subColor: team.subColor
        }),
        rejectReason: '',
        status: TeamEnrollStatus.Received,
        username: 'team01',
        id: 1
      }
      const requestTeamDTO: RegisterTeamRequestDTO = {
        accountId: 1,
        data: {
          name: team.name,
          associationId: team.associationId,
          color: team.color,
          establishedAt: team.establishedAt,
          globalName: team.globalName,
          hometown: team.hometown,
          initial: team.initial,
          subColor: team.subColor
        },
        teamAccountUsername: 'team01'
      }
      mockAccountService.isAccountExist.resolves(false)
      mockAccountService.isEmailExist.resolves(false)
      mockAccountService.isVerifiedAccount.resolves(true)
      mockAccountService.getAccountProfile.resolves({
        email
      })
      db.registerTeamRequest.findFirst.resolves(null)
      db.registerTeamRequest.create.resolves(returnValue)

      // when
      const result = await service.createRegisterTeamRequest(requestTeamDTO)

      // then
      expect(result).to.be.deep.equal(returnValue)
      expect(
        db.registerTeamRequest.create.calledOnceWith({
          data: {
            data: {
              name: team.name,
              associationId: team.associationId,
              color: team.color,
              establishedAt: team.establishedAt,
              globalName: team.globalName,
              hometown: team.hometown,
              initial: team.initial,
              subColor: team.subColor
            },
            accountId: requestTeamDTO.accountId,
            status: TeamEnrollStatus.Received,
            username: requestTeamDTO.teamAccountUsername
          }
        })
      ).to.be.true
      expect(
        db.registerTeamRequest.findFirst.calledOnceWith({
          where: {
            accountId: requestTeamDTO.accountId,
            status: TeamEnrollStatus.Received
          }
        })
      ).to.be.true
    })

    it('should throw BusinessException when BusinessException occurs', async () => {
      // given
      mockAccountService.isVerifiedAccount.resolves(true)
      mockAccountService.getAccountProfile.resolves({
        email: 'test@example.com'
      })
      db.registerTeamRequest.findFirst.resolves('test')
      const requestTeamDTO: RegisterTeamRequestDTO = {
        accountId: 1,
        data: {
          name: team.name,
          associationId: team.associationId,
          color: team.color,
          establishedAt: team.establishedAt,
          globalName: team.globalName,
          hometown: team.hometown,
          initial: team.initial,
          subColor: team.subColor
        },
        teamAccountUsername: 'team01'
      }

      // then
      await expect(
        service.createRegisterTeamRequest(requestTeamDTO)
      ).to.be.rejectedWith(ConflictFoundException)
    })

    it('should throw BusinessException when BusinessException occurs', async () => {
      // given
      mockAccountService.isVerifiedAccount.resolves(true)
      mockAccountService.getAccountProfile.resolves({
        email: 'test@example.com'
      })
      mockAccountService.isAccountExist(null)
      mockAccountService.isEmailExist.resolves(true)
      db.registerTeamRequest.findFirst.resolves(null)
      const requestTeamDTO: RegisterTeamRequestDTO = {
        accountId: 1,
        data: {
          name: team.name,
          associationId: team.associationId,
          color: team.color,
          establishedAt: team.establishedAt,
          globalName: team.globalName,
          hometown: team.hometown,
          initial: team.initial,
          subColor: team.subColor
        },
        teamAccountUsername: 'team01'
      }

      // then
      await expect(
        service.createRegisterTeamRequest(requestTeamDTO)
      ).to.be.rejectedWith(ConflictFoundException)
    })

    it('should throw BusinessException when BusinessException occurs', async () => {
      // given
      mockAccountService.isVerifiedAccount.resolves(true)
      mockAccountService.getAccountProfile.resolves({
        email: 'test@example.com'
      })
      mockAccountService.isAccountExist.resolves('test')
      db.registerTeamRequest.findFirst.resolves(null)
      const requestTeamDTO: RegisterTeamRequestDTO = {
        accountId: 1,
        data: {
          name: team.name,
          associationId: team.associationId,
          color: team.color,
          establishedAt: team.establishedAt,
          globalName: team.globalName,
          hometown: team.hometown,
          initial: team.initial,
          subColor: team.subColor
        },
        teamAccountUsername: 'team01'
      }

      // then
      await expect(
        service.createRegisterTeamRequest(requestTeamDTO)
      ).to.be.rejectedWith(ConflictFoundException)
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      mockAccountService.isVerifiedAccount.resolves(true)
      mockAccountService.getAccountProfile.resolves({
        email: 'test@example.com'
      })
      mockAccountService.isAccountExist.rejects(new Error('test'))
      db.registerTeamRequest.findFirst.resolves(null)
      const requestTeamDTO: RegisterTeamRequestDTO = {
        accountId: 1,
        data: {
          name: team.name,
          associationId: team.associationId,
          color: team.color,
          establishedAt: team.establishedAt,
          globalName: team.globalName,
          hometown: team.hometown,
          initial: team.initial,
          subColor: team.subColor
        },
        teamAccountUsername: 'team01'
      }

      // then
      await expect(
        service.createRegisterTeamRequest(requestTeamDTO)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })
})
