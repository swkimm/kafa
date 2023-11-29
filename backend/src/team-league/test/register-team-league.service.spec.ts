import { Test, type TestingModule } from '@nestjs/testing'
import {
  ConflictFoundException,
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { LeagueApplyStatus, Prisma, type TeamLeague } from '@prisma/client'
import { expect } from 'chai'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import type { RegisterTeamLeagueService } from '../interface/register-team-league.service.interface'
import { RegisterTeamLeagueServiceImpl } from '../service/register-team-league.service'

describe('RegisterTeamLeagueService', () => {
  const db = {
    teamLeague: {
      create: sinon.stub()
    }
  }

  const teamLeague: TeamLeague = {
    leagueId: 1,
    rank: 1,
    teamId: 1,
    applyStatus: LeagueApplyStatus.Approved,
    rejectReason: ''
  }

  let service: RegisterTeamLeagueService<TeamLeague>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'RegisterTeamLeagueService',
          useClass: RegisterTeamLeagueServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        }
      ]
    }).compile()

    service = module.get<RegisterTeamLeagueService<TeamLeague>>(
      'RegisterTeamLeagueService'
    )

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).to.be.ok
  })

  describe('registerTeamLeague', () => {
    it('should return registered team', async () => {
      // given
      const { teamId, leagueId } = teamLeague
      db.teamLeague.create.resolves(teamLeague)

      // when
      const result = await service.registerTeamLeague(teamId, leagueId)

      // then
      expect(result).to.be.deep.equal(teamLeague)
      expect(
        db.teamLeague.create.calledOnceWith({
          data: {
            teamId,
            leagueId
          }
        })
      ).to.be.true
    })

    it('should throw ConflictFoundException when duplicate teamId and leagueId pair passed', async () => {
      // given
      const { teamId, leagueId } = teamLeague
      db.teamLeague.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2002'
        })
      )

      // then
      await expect(
        service.registerTeamLeague(teamId, leagueId)
      ).to.be.rejectedWith(ConflictFoundException)
    })

    it('should throw EntityNotExistException when invalid teamId or leagueId passed', async () => {
      // given
      const { teamId, leagueId } = teamLeague
      db.teamLeague.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(
        service.registerTeamLeague(teamId, leagueId)
      ).to.be.rejectedWith(EntityNotExistException)
    })

    it('should throw UnexpectedException when unhandled exception occurs', async () => {
      // given
      const { teamId, leagueId } = teamLeague
      db.teamLeague.create.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1011'
        })
      )

      // then
      await expect(
        service.registerTeamLeague(teamId, leagueId)
      ).to.be.rejectedWith(UnexpectedException)
    })
  })
})
