import { Inject, Injectable } from '@nestjs/common'
import type { Game } from '@prisma/client'
import { GameService } from '../abstract/game.service'
import { CreateGameService } from '../interface/create-game.service.interface'
import { DeleteGameService } from '../interface/delete-game.service.interface'
import { GetGameService } from '../interface/get-game.service.interface'
import { UpdateGameService } from '../interface/update-game.service.interface'

@Injectable()
export class GameServiceImpl extends GameService<Game> {
  constructor(
    @Inject('GetGameService')
    getGameService: GetGameService<Game>,
    @Inject('UpdateGameService')
    updateGameService: UpdateGameService<Game>,
    @Inject('CreateGameService')
    createGameService: CreateGameService<Game>,
    @Inject('DeleteGameService')
    deleteGameService: DeleteGameService<Game>
  ) {
    super(
      getGameService,
      updateGameService,
      createGameService,
      deleteGameService
    )
  }
}
