import { Inject, Injectable } from '@nestjs/common'
import type { Score } from '@prisma/client'
import { ScoreService } from '../abstract/score.service'
import { CreateScoreService } from '../interface/create-score.service.interface'
import { GetScoreService } from '../interface/get-scores.service.interface'
import { UpdateScoreService } from '../interface/update-score.service.interface'

@Injectable()
export class ScoreServiceImpl extends ScoreService<Score> {
  constructor(
    @Inject('GetScoreService') getScoreService: GetScoreService<Score>,
    @Inject('UpdateScoreService') updateScoreService: UpdateScoreService<Score>,
    @Inject('CreateScoreService') createScoreService: CreateScoreService<Score>
  ) {
    super(getScoreService, updateScoreService, createScoreService)
  }
}
