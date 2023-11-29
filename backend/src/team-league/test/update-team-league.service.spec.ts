import { Test, type TestingModule } from '@nestjs/testing'
import {
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { LeagueApplyStatus, Prisma, type TeamLeague } from '@prisma/client'
import { expect } from 'chai'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import type { UpdateTeamLeagueService } from '../interface/update-team-league.service.interface'
import { UpdateTeamLeagueServiceImpl } from '../service/update-team-league.service'

describe('UpdateTeamLeagueService', () => {
  const db = {
    teamLeague: {
      update: sinon.stub()
    }
  }

  const teamLeague: TeamLeague = {
    leagueId: 1,
    rank: 1,
    teamId: 1,
    applyStatus: LeagueApplyStatus.Approved,
    rejectReason: ''
  }

  let service: UpdateTeamLeagueService<TeamLeague>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UpdateTeamLeagueService',
          useClass: UpdateTeamLeagueServiceImpl
        },
        {
          provide: PrismaService,
          useValue: db
        }
      ]
    }).compile()

    service = module.get<UpdateTeamLeagueService<TeamLeague>>(
      'UpdateTeamLeagueService'
    )

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).to.be.ok
  })

  describe('updateTeamLeague', () => {
    it('should return updated team', async () => {
      // given
      const teamLeagueDTO = {
        teamId: 1,
        leagueId: 1,
        applyStatus: LeagueApplyStatus.Approved
      }
      const { teamId, leagueId, applyStatus } = teamLeagueDTO
      db.teamLeague.update.resolves(teamLeague)

      // when
      const result = await service.updateTeamLeague(teamLeagueDTO)

      // then
      expect(result).to.be.deep.equal(teamLeague)
      expect(
        db.teamLeague.update.calledOnceWith({
          where: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            teamId_leagueId: {
              teamId,
              leagueId
            }
          },
          data: {
            applyStatus
          }
        })
      ).to.be.true
    })

    it('should throw EntityNotExistException when invalid teamId or leagueId passed', async () => {
      // given
      const teamLeagueDTO = {
        teamId: 1,
        leagueId: 1,
        applyStatus: LeagueApplyStatus.Approved
      }
      db.teamLeague.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P2025'
        })
      )

      // then
      await expect(service.updateTeamLeague(teamLeagueDTO)).to.be.rejectedWith(
        EntityNotExistException
      )
    })

    it('should throw UnexpectedException when unhandled exception occurs', async () => {
      // given
      const teamLeagueDTO = {
        teamId: 1,
        leagueId: 1,
        applyStatus: LeagueApplyStatus.Approved
      }
      db.teamLeague.update.rejects(
        new Prisma.PrismaClientKnownRequestError('test', {
          clientVersion: '1.0.0',
          code: 'P1011'
        })
      )

      // then
      await expect(service.updateTeamLeague(teamLeagueDTO)).to.be.rejectedWith(
        UnexpectedException
      )
    })

    it('should throw ParameterValidationException when Invalid parameter passed', async () => {
      // given
      const teamLeagueDTO = {
        teamId: 1,
        leagueId: 1,
        applyStatus: 'abc'
      }

      // then
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(service.updateTeamLeague(teamLeagueDTO)).to.be.rejectedWith(
        ParameterValidationException
      )
    })
  })
})
