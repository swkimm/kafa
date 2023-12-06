import { Inject, Injectable } from '@nestjs/common'
import type { Sponser } from '@prisma/client'
import { SponserService } from '../abstract/sponser.service'
import type { CreateSponserDTO } from '../dto/create-sponser.dto'
import type { UpdateSponserDTO } from '../dto/update-sponser.dto'
import { CreateSponserService } from '../interface/create-sponser.service.interface'
import { DeleteSponserService } from '../interface/delete-sponser.service.interface'
import { GetSponserService } from '../interface/get-sponser.service.interface'
import { UpdateSponserService } from '../interface/update-sponser.service.interface'

@Injectable()
export class SponserServiceImpl extends SponserService<Sponser> {
  constructor(
    @Inject('CreateSponserService')
    private readonly createSponserService: CreateSponserService<Sponser>,
    @Inject('UpdateSponserService')
    private readonly updateSponserService: UpdateSponserService<Sponser>,
    @Inject('DeleteSponserService')
    private readonly deleteSponserService: DeleteSponserService<Sponser>,
    @Inject('GetSponserService')
    private readonly getSponserService: GetSponserService<Sponser>
  ) {
    super()
  }

  async getSponser(sponserId: number): Promise<Sponser> {
    return await this.getSponserService.getSponser(sponserId)
  }

  async getSponsers(page: number, limit = 10): Promise<Sponser[]> {
    return await this.getSponserService.getSponsers(page, limit)
  }

  async createSponser(sponserDTO: CreateSponserDTO): Promise<Sponser> {
    return await this.createSponserService.createSponser(sponserDTO)
  }

  async updateSponser(
    sponserId: number,
    sponserDTO: UpdateSponserDTO
  ): Promise<Sponser> {
    return await this.updateSponserService.updateSponser(sponserId, sponserDTO)
  }

  async deleteSponser(sponserId: number): Promise<Sponser> {
    return await this.deleteSponserService.deleteSponser(sponserId)
  }
}
