import { Inject, Injectable } from '@nestjs/common'
import type { TeamLeague } from '@prisma/client'
import { TeamLeagueService } from '../abstract/team-league.service'
import { GetTeamLeagueService } from '../interface/get-team-league.service.interface'
import { RegisterTeamLeagueService } from '../interface/register-team-league.service.interface'
import { UpdateTeamLeagueService } from '../interface/update-team-league.service.interface'

/**
 * 팀과 리그를 중계하는 서브 모듈 [TeamLeagueService] 구현체
 */
@Injectable()
export class TeamLeagueServiceImpl extends TeamLeagueService<TeamLeague> {
  constructor(
    @Inject('GetTeamLeagueService')
    getTeamLeagueService: GetTeamLeagueService<TeamLeague>,
    @Inject('UpdateTeamLeagueService')
    updateTeamLeagueService: UpdateTeamLeagueService<TeamLeague>,
    @Inject('RegisterTeamLeagueService')
    registerTeamLeagueService: RegisterTeamLeagueService<TeamLeague>
  ) {
    super(
      getTeamLeagueService,
      registerTeamLeagueService,
      updateTeamLeagueService
    )
  }
}
