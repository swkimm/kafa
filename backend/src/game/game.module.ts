import { Module } from '@nestjs/common'
import { LeagueModule } from '@/league/league.module'
import { ScoreModule } from '@/score/score.module'
import { TeamModule } from '@/team/team.module'
import { AdminGameController } from './admin-game.controller'
import { GameController } from './game.controller'
import { CreateGameServiceImpl } from './service/create-game.service'
import { DeleteGameServiceImpl } from './service/delete-game.service'
import { GameServiceImpl } from './service/game.service'
import { GetGameServiceImpl } from './service/get-game.service'
import { UpdateGameServiceImpl } from './service/update-game.service'

@Module({
  imports: [LeagueModule, ScoreModule, TeamModule],
  controllers: [GameController, AdminGameController],
  providers: [
    {
      provide: 'GetGameService',
      useClass: GetGameServiceImpl
    },
    {
      provide: 'UpdateGameService',
      useClass: UpdateGameServiceImpl
    },
    {
      provide: 'CreateGameService',
      useClass: CreateGameServiceImpl
    },
    {
      provide: 'DeleteGameService',
      useClass: DeleteGameServiceImpl
    },
    {
      provide: 'GameService',
      useClass: GameServiceImpl
    }
  ],
  exports: [
    {
      provide: 'GameService',
      useClass: GameServiceImpl
    }
  ]
})
export class GameModule {}
