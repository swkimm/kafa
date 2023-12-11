import { Inject, Injectable } from '@nestjs/common'
import type { Sponser } from '@prisma/client'
import { SponserService } from '../abstract/sponser.service'
import { CreateSponserService } from '../interface/create-sponser.service.interface'
import { DeleteSponserService } from '../interface/delete-sponser.service.interface'
import { GetSponserService } from '../interface/get-sponser.service.interface'
import { UpdateSponserService } from '../interface/update-sponser.service.interface'

/**
 * 스폰서 관련 서비스들을 모은 추상 클래스[SponserService]의 구현체
 */
@Injectable()
export class SponserServiceImpl extends SponserService<Sponser> {
  constructor(
    @Inject('CreateSponserService')
    createSponserService: CreateSponserService<Sponser>,
    @Inject('UpdateSponserService')
    updateSponserService: UpdateSponserService<Sponser>,
    @Inject('DeleteSponserService')
    deleteSponserService: DeleteSponserService<Sponser>,
    @Inject('GetSponserService')
    getSponserService: GetSponserService<Sponser>
  ) {
    super(
      getSponserService,
      deleteSponserService,
      createSponserService,
      updateSponserService
    )
  }
}
