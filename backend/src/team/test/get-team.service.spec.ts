import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import {
  type Team,
  type TeamLeague,
  LeagueApplyStatus,
  Prisma,
  TeamStatus,
  type RegisterTeamRequest,
  TeamEnrollStatus
} from '@prisma/client'
import { expect } from 'chai'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import type { GetTeamService } from '../interface/get-team.service.interface'
import { GetTeamServiceImpl } from '../service/get-team.service'

describe('GetTeamService', () => {
  const db = {
    team: {
      findUniqueOrThrow: sinon.stub(),
      findMany: sinon.stub()
    },
    registerTeamRequest: {
      findMany: sinon.stub()
    }
  }

  const mockTeamLeagueService = {
    getTeamLeaguesByLeagueId: sinon.stub(),
    getTeamLeaguesByTeamId: sinon.stub(),
    registerTeamLeague: sinon.stub(),
    updateTeamLeague: sinon.stub()
  }

  const teams: Team[] = [
    {
      id: 1,
      associationId: 1,
      backgroundImgUrl: '',
      color: '#123456',
      status: TeamStatus.Enabled,
      establishedAt: new Date('2023-01-01'),
      globalName: 'team01',
      hometown: 'hometown',
      initial: 'team01',
      message: '',
      name: 'team01',
      profileImgUrl: '',
      subColor: '',
      deletedAt: undefined,
      createdAt: new Date()
    },
    {
      id: 2,
      associationId: 2,
      backgroundImgUrl: '',
      color: '#123456',
      status: TeamStatus.Enabled,
      establishedAt: new Date('2023-01-01'),
      message: '',
      globalName: 'team02',
      hometown: 'hometown',
      initial: 'team02',
      name: 'team02',
      profileImgUrl: '',
      subColor: '',
      deletedAt: undefined,
      createdAt: new Date()
    },
    {
      id: 3,
      associationId: 3,
      backgroundImgUrl: '',
      color: '#123456',
      status: TeamStatus.Enabled,
      establishedAt: new Date('2023-01-01'),
      message: '',
      globalName: 'team03',
      hometown: 'hometown',
      initial: 'team03',
      name: 'team03',
      profileImgUrl: '',
      subColor: '',
      deletedAt: undefined,
      createdAt: new Date()
    }
  ]

  const teamLeagues: TeamLeague[] = [
    {
      teamId: 1,
      leagueId: 1,
      rank: undefined,
      applyStatus: LeagueApplyStatus.Approved,
      rejectReason: ''
    },
    {
      teamId: 2,
      leagueId: 1,
      rank: undefined,
      applyStatus: LeagueApplyStatus.Approved,
      rejectReason: ''
    },
    {
      teamId: 3,
      leagueId: 1,
      rank: undefined,
      applyStatus: LeagueApplyStatus.Approved,
      rejectReason: ''
    }
  ]

  const registerTeamRequests: RegisterTeamRequest[] = [
    {
      id: 1,
      accountId: 1,
      createdAt: new Date(),
      data: {
        test: 'test'
      },
      rejectReason: undefined,
      status: TeamEnrollStatus.Received,
      username: 'test'
    }
  ]

  const mockAssociationService = {
    getAssociation: sinon.stub()
  }

  let service: GetTeamService<Team, RegisterTeamRequest>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'GetTeamService',
          useClass: GetTeamServiceImpl
        },
        { provide: 'TeamLeagueService', useValue: mockTeamLeagueService },
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

    service =
      module.get<GetTeamService<Team, RegisterTeamRequest>>('GetTeamService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).to.be.ok
  })

  describe('getTeam', () => {
    it('it should return team', async () => {
      // given
      const teamId = 1
      db.team.findUniqueOrThrow.resolves(teams[0])

      // when
      const result = await service.getTeam(teamId)

      // then
      expect(result).to.be.deep.equal(teams[0])
      expect(
        db.team.findUniqueOrThrow.calledOnceWith({
          where: {
            id: teamId
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid teamId passed', async () => {
      // given
      const teamId = 1
      db.team.findUniqueOrThrow.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(service.getTeam(teamId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const teamId = 1
      db.team.findUniqueOrThrow.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2099'
        })
      )

      // then
      await expect(service.getTeam(teamId)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })

  describe('getTeams', () => {
    it('should return teams', async () => {
      // given
      const limit = 10
      const page = 0
      db.team.findMany.resolves(teams)

      // when
      const result = await service.getTeams(page, limit)

      // then
      expect(result).to.be.deep.equal(teams)
      expect(
        db.team.findMany.calledOnceWith({
          take: limit,
          skip: (page - 1) * (limit || 10),
          orderBy: {
            name: 'asc'
          },
          where: {
            status: TeamStatus.Enabled
          }
        })
      ).to.be.true
    })

    it('should throw ParameterValidationException when invalid option passed', async () => {
      // given
      const limit = 10
      const cursor = 0
      const option = 'test'

      // then
      await expect(service.getTeams(limit, cursor, option)).to.be.rejectedWith(
        ParameterValidationException
      )
    })
  })

  describe('getAssociationTeams', () => {
    it('it should return teams', async () => {
      // given
      const associationId = 1
      db.team.findMany.resolves(teams)

      // when
      const result = await service.getAssociationTeams(associationId)

      // then
      expect(result).to.be.deep.equal(teams)
      expect(
        db.team.findMany.calledOnceWith({
          where: {
            associationId,
            status: 'Enabled'
          },
          orderBy: {
            name: 'asc'
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid asscoiationId passed', async () => {
      // given
      const associationId = 1
      mockAssociationService.getAssociation.rejects(
        new EntityNotExistException('test')
      )

      // then
      await expect(
        service.getAssociationTeams(associationId)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const associationId = 1
      db.team.findMany.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2099'
        })
      )

      // then
      await expect(
        service.getAssociationTeams(associationId)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })

  describe('getLeagueTeams', () => {
    it('it should return teams', async () => {
      // given
      const leagueId = 1
      db.team.findMany.resolves(teams)
      mockTeamLeagueService.getTeamLeaguesByLeagueId.resolves(teamLeagues)

      // when
      const result = await service.getLeagueTeams(leagueId)

      // then
      expect(result).to.be.deep.equal(teams)
      expect(
        mockTeamLeagueService.getTeamLeaguesByLeagueId.calledOnceWith(leagueId)
      ).to.be.true
      expect(
        db.team.findMany.calledOnceWith({
          where: {
            id: {
              in: teamLeagues.map((team) => team.teamId)
            }
          }
        })
      ).to.be.true
    })

    it('should pass exception when exception is instanceof BusinessException', async () => {
      // given
      const leagueId = 1
      mockTeamLeagueService.getTeamLeaguesByLeagueId.rejects(
        new EntityNotExistException('test')
      )

      // then
      await expect(service.getLeagueTeams(leagueId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('it should throw UnexpectedException when unexpected error occurs', async () => {
      // given
      const leagueId = 1
      db.team.findMany.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2099'
        })
      )
      mockTeamLeagueService.getTeamLeaguesByLeagueId.resolves(teamLeagues)

      // then
      await expect(service.getLeagueTeams(leagueId)).to.be.rejectedWith(
        UnexpectedException
      )
    })
  })

  describe('getAccountRegisterTeamRequests', () => {
    it('should return register team requests', async () => {
      // given
      const accountId = 1
      db.registerTeamRequest.findMany.resolves(registerTeamRequests)

      // when
      const result = await service.getAccountRegisterTeamRequests(accountId)

      // then
      expect(result).to.be.deep.equal(registerTeamRequests)
      expect(
        db.registerTeamRequest.findMany.calledOnceWith({
          where: {
            accountId
          }
        })
      ).to.be.true
    })

    describe('getRegisterTeamRequests', () => {
      it('should return registerTeamRequests', async () => {
        // given
        const limit = 10
        const cursor = 0
        const option = 'Approved'
        db.registerTeamRequest.findMany.resolves(registerTeamRequests)

        // when
        const result = await service.getRegisterTeamRequests(
          limit,
          cursor,
          option
        )

        // then
        expect(result).to.be.deep.equal(registerTeamRequests)
        expect(
          db.registerTeamRequest.findMany.calledOnceWith({
            take: limit,
            skip: 0,
            cursor: undefined,
            orderBy: {
              id: 'desc'
            },
            where: {
              status: option
            }
          })
        ).to.be.true
      })

      it('should return registerTeamRequests', async () => {
        // given
        const limit = 10
        const cursor = 1
        db.registerTeamRequest.findMany.resolves(registerTeamRequests)

        // when
        const result = await service.getRegisterTeamRequests(limit, cursor)

        // then
        expect(result).to.be.deep.equal(registerTeamRequests)
        expect(
          db.registerTeamRequest.findMany.calledOnceWith({
            take: limit,
            skip: 1,
            cursor: { id: 1 },
            orderBy: {
              id: 'desc'
            },
            where: {
              status: undefined
            }
          })
        ).to.be.true
      })

      it('should throw ParameterValidationException when invalid option passed', async () => {
        // given
        const limit = 10
        const cursor = 0
        const option = 'Test'

        // when
        await expect(
          service.getRegisterTeamRequests(limit, cursor, option)
        ).to.be.rejectedWith(ParameterValidationException)
      })
    })
  })
})
