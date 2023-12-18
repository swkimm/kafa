import { Module } from '@nestjs/common'
import { CreateScoreServiceImpl } from './service/create-score.service'
import { GetScoreServiceImpl } from './service/get-score.service'
import { ScoreServiceImpl } from './service/score.service'
import { UpdateScoreServiceImpl } from './service/update-score.service'

@Module({
  providers: [
    {
      provide: 'ScoreService',
      useClass: ScoreServiceImpl
    },
    {
      provide: 'GetScoreService',
      useClass: GetScoreServiceImpl
    },
    {
      provide: 'UpdateScoreService',
      useClass: UpdateScoreServiceImpl
    },
    {
      provide: 'CreateScoreService',
      useClass: CreateScoreServiceImpl
    }
  ],
  exports: [
    {
      provide: 'ScoreService',
      useClass: ScoreServiceImpl
    }
  ]
})
export class ScoreModule {}
