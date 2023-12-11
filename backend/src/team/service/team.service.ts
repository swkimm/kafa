import { Inject, Injectable } from '@nestjs/common'
import type { RegisterTeamRequest, Team } from '@prisma/client'
import { TeamService } from '../abstract/team.service'
import { DeleteTeamService } from '../interface/delete-team.service.interface'
import { GetTeamService } from '../interface/get-team.service.interface'
import { RegisterTeamService } from '../interface/register-team.service.interface'
import { UpdateTeamService } from '../interface/update-team.service.interface'

@Injectable()
export class TeamServiceImpl extends TeamService<
  Team,
  { result: string },
  RegisterTeamRequest
> {
  constructor(
    @Inject('RegisterTeamService')
    registerTeamService: RegisterTeamService<Team, RegisterTeamRequest>,
    @Inject('DeleteTeamService')
    deleteTeamService: DeleteTeamService<{ result: string }>,
    @Inject('UpdateTeamService')
    updateTeamService: UpdateTeamService<Team, RegisterTeamRequest>,
    @Inject('GetTeamService')
    getTeamService: GetTeamService<Team, RegisterTeamRequest>
  ) {
    super(
      registerTeamService,
      deleteTeamService,
      updateTeamService,
      getTeamService
    )
  }
}
