import { Test, type TestingModule } from '@nestjs/testing'
import { LeagueApplyStatus, type TeamLeague } from '@prisma/client'
import { expect } from 'chai'
import { describe } from 'mocha'
import * as sinon from 'sinon'
import type { TeamLeagueService } from '../abstract/team-league.service'
import { TeamLeagueServiceImpl } from '../service/team-league.service'

describe('TeamLeagueService', () => {
  const mockGetTeamLeagueService = {
    getTeamLeaguesByLeagueId: sinon.stub(),
    getTeamLeaguesByTeamId: sinon.stub()
  }

  const mockRegisterTeamLeagueService = {
    registerTeamLeague: sinon.stub()
  }

  const mockUpdateTeamLeagueService = {
    updateTeamLeague: sinon.stub()
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

  let service: TeamLeagueService<TeamLeague>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'RegisterTeamLeagueService',
          useValue: mockRegisterTeamLeagueService
        },
        {
          provide: 'UpdateTeamLeagueService',
          useValue: mockUpdateTeamLeagueService
        },
        {
          provide: 'GetTeamLeagueService',
          useValue: mockGetTeamLeagueService
        },
        { provide: 'TeamLeagueService', useClass: TeamLeagueServiceImpl }
      ]
    }).compile()

    service = module.get<TeamLeagueService<TeamLeague>>('TeamLeagueService')

    sinon.reset()
  })

  afterEach(() => {
    sinon.reset()
  })

  it('should be defined', () => {
    expect(service).to.be.ok
  })

  describe('getTeamLeaguesByLeagueId', () => {
    it('should return teamleagues', async () => {
      // given
      const leagueId = 1
      mockGetTeamLeagueService.getTeamLeaguesByLeagueId.resolves(teamLeagues)

      // when
      const result = await service.getTeamLeaguesByLeagueId(leagueId)

      // then
      expect(result).to.be.deep.equal(teamLeagues)
      expect(
        mockGetTeamLeagueService.getTeamLeaguesByLeagueId.calledOnceWith(
          leagueId
        )
      ).to.be.true
    })
  })

  describe('getTeamLeaguesByTeamId', () => {
    it('should return teamleagues', async () => {
      // given
      const teamId = 1
      mockGetTeamLeagueService.getTeamLeaguesByTeamId.resolves(teamLeagues)

      // when
      const result = await service.getTeamLeaguesByTeamId(teamId)

      // then
      expect(result).to.be.deep.equal(teamLeagues)
      expect(
        mockGetTeamLeagueService.getTeamLeaguesByTeamId.calledOnceWith(teamId)
      ).to.be.true
    })
  })

  describe('registerTeamLeague', () => {
    it('should return registered teamleague', async () => {
      // given
      const teamId = 1
      const leagueId = 1
      mockRegisterTeamLeagueService.registerTeamLeague.resolves(teamLeagues[0])

      // when
      const result = await service.registerTeamLeague(teamId, leagueId)

      // then
      expect(result).to.be.deep.equal(teamLeagues[0])
      expect(
        mockRegisterTeamLeagueService.registerTeamLeague.calledOnceWith(
          teamId,
          leagueId
        )
      ).to.be.true
    })
  })

  describe('updateTeamLeague', () => {
    it('should return updated teamleague', async () => {
      // given
      const teamLeagueDTO = {
        teamId: 1,
        leagueId: 1,
        applyStatus: LeagueApplyStatus.Approved
      }
      mockUpdateTeamLeagueService.updateTeamLeague.resolves(teamLeagues[0])

      // when
      const result = await service.updateTeamLeague(teamLeagueDTO)

      // then
      expect(result).to.be.deep.equal(teamLeagues[0])
      expect(
        mockUpdateTeamLeagueService.updateTeamLeague.calledOnceWith(
          teamLeagueDTO
        )
      ).to.be.true
    })
  })
})
