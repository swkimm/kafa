import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { LeagueApplyStatus, Prisma, type TeamLeague } from '@prisma/client'
import { expect } from 'chai'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import type { GetTeamLeagueService } from '../interface/get-team-league.service.interface'
import { GetTeamLeagueServiceImpl } from '../service/get-team-league.service'

describe('GetTeamLeagueService', () => {
  const db = {
    teamLeague: {
      findMany: sinon.stub(),
      findUniqueOrThrow: sinon.stub()
    },
    team: {
      findUniqueOrThrow: sinon.stub()
    },
    league: {
      findUniqueOrThrow: sinon.stub()
    }
  }

  const teamLeagues: TeamLeague[] = [
    {
      leagueId: 1,
      rank: 1,
      teamId: 1,
      applyStatus: LeagueApplyStatus.Approved,
      rejectReason: ''
    },
    {
      leagueId: 1,
      rank: 2,
      teamId: 2,
      applyStatus: LeagueApplyStatus.Approved,
      rejectReason: ''
    },
    {
      leagueId: 2,
      rank: 1,
      teamId: 1,
      applyStatus: LeagueApplyStatus.Approved,
      rejectReason: ''
    },
    {
      leagueId: 2,
      rank: 2,
      teamId: 2,
      applyStatus: LeagueApplyStatus.Approved,
      rejectReason: ''
    }
  ]

  let service: GetTeamLeagueService<TeamLeague>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'GetTeamLeagueService',
          useClass: GetTeamLeagueServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        }
      ]
    }).compile()

    service = module.get<GetTeamLeagueService<TeamLeague>>(
      'GetTeamLeagueService'
    )

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).to.be.ok
  })

  describe('getTeamLeague', () => {
    it('should return teamLeague', async () => {
      // given
      const teamId = 1
      const leagueId = 1
      db.teamLeague.findUniqueOrThrow.resolves(teamLeagues[0])

      // when
      const result = await service.getTeamLeague(teamId, leagueId)

      // then
      expect(result).to.be.deep.equal(teamLeagues[0])
      expect(
        db.teamLeague.findUniqueOrThrow.calledOnceWith({
          where: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            teamId_leagueId: {
              teamId,
              leagueId
            }
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException', async () => {
      // given
      const teamId = 1
      const leagueId = 1
      db.teamLeague.findUniqueOrThrow.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(service.getTeamLeague(teamId, leagueId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })
  })

  describe('getTeamLeaguesByLeagueId', () => {
    it('should return teamLeagues', async () => {
      // given
      const leagueId = 1
      const results = [teamLeagues[0], teamLeagues[1]]
      db.league.findUniqueOrThrow.resolves()
      db.teamLeague.findMany.resolves(results)

      // when
      const result = await service.getTeamLeaguesByLeagueId(leagueId)

      // then
      expect(result).to.be.deep.equal(results)
      expect(
        db.teamLeague.findMany.calledOnceWith({
          where: {
            leagueId,
            applyStatus: LeagueApplyStatus.Approved
          }
        })
      ).to.be.true
    })

    it('should throw unexpectedException', async () => {
      // given
      const leagueId = 1
      db.league.findUniqueOrThrow.resolves()
      db.teamLeague.findMany.rejects(new Error('test'))

      // then
      await expect(
        service.getTeamLeaguesByLeagueId(leagueId)
      ).to.be.rejectedWith(UnexpectedException)
    })

    it('should throw EntityNotExistException when invalid leagueId passed', async () => {
      // given
      const leagueId = 1
      db.league.findUniqueOrThrow.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(
        service.getTeamLeaguesByLeagueId(leagueId)
      ).to.be.rejectedWith(EntityNotExistException)
    })
  })

  describe('getTeamLeaguesByTeamId', () => {
    it('should return teamLeagues', async () => {
      // given
      const teamId = 1
      const results = [teamLeagues[0], teamLeagues[2]]
      db.team.findUniqueOrThrow.resolves()
      db.teamLeague.findMany.resolves(results)

      // when
      const result = await service.getTeamLeaguesByTeamId(teamId)

      // then
      expect(result).to.be.deep.equal(results)
      expect(
        db.teamLeague.findMany.calledOnceWith({
          where: {
            teamId,
            applyStatus: LeagueApplyStatus.Approved
          }
        })
      ).to.be.true
    })

    it('should throw unexpectedException', async () => {
      // given
      const teamId = 1
      db.team.findUniqueOrThrow.resolves()
      db.teamLeague.findMany.rejects(new Error('test'))

      // then
      await expect(service.getTeamLeaguesByTeamId(teamId)).to.be.rejectedWith(
        UnexpectedException
      )
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
      await expect(service.getTeamLeaguesByTeamId(teamId)).to.be.rejectedWith(
        EntityNotExistException
      )
    })
  })
})
