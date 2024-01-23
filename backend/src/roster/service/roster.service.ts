import { Inject, Injectable } from '@nestjs/common'
import type { Roster } from '@prisma/client'
import { RosterService } from '../abstract/roster.service'
import { ConnectRosterService } from '../interface/connect-roster.service.interface'
import { CreateRosterService } from '../interface/create-roster.service.interface'
import { DeleteRosterService } from '../interface/delete-roster.service.interface'
import { GetRosterService } from '../interface/get-roster.service.interface'
import { UpdateRosterService } from '../interface/update-roster.interface'

@Injectable()
export class RosterServiceImpl extends RosterService<Roster> {
  constructor(
    @Inject('GetRosterService') getRosterService: GetRosterService,
    @Inject('CreateRosterService')
    createRosterService: CreateRosterService<Roster>,
    @Inject('UpdateRosterService')
    updateRosterService: UpdateRosterService,
    @Inject('DeleteRosterService')
    deleteRosterService: DeleteRosterService<Roster>,
    @Inject('ConnectRosterService')
    connectRosterService: ConnectRosterService
  ) {
    super(
      getRosterService,
      createRosterService,
      deleteRosterService,
      updateRosterService,
      connectRosterService
    )
  }
}
