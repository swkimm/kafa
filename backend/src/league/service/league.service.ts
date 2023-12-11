import { Inject, Injectable } from '@nestjs/common'
import type { League, Sponser } from '@prisma/client'
import { LeagueService } from '../abstract/league.service'
import { CreateLeagueService } from '../interface/create-league.service.interface'
import { DeleteLeagueService } from '../interface/delete-league.service.interface'
import { GetLeagueService } from '../interface/get-league.service.interface'
import { UpdateLeagueService } from '../interface/update-league.service.interface'

/**
 * 리그 관련 서비스들을 모은 추상 클래스[LeagueService]의 구현체
 */
@Injectable()
export class LeagueServiceImpl extends LeagueService<League, Sponser> {
  constructor(
    @Inject('CreateLeagueService')
    createLeagueService: CreateLeagueService<League>,
    @Inject('DeleteLeagueService')
    deleteLeagueService: DeleteLeagueService<League>,
    @Inject('UpdateLeagueService')
    updateLeagueService: UpdateLeagueService<League>,
    @Inject('GetLeagueService')
    getLeagueService: GetLeagueService<League, Sponser>
  ) {
    super(
      createLeagueService,
      deleteLeagueService,
      updateLeagueService,
      getLeagueService
    )
  }
}
