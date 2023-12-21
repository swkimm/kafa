import { Inject, Injectable } from '@nestjs/common'
import {
  BusinessException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { SponserService } from '@/sponser/abstract/sponser.service'
import { ImageStorageService } from '@/storage/interface/image-storage.service.interface'
import type { Sponser } from '@prisma/client'
import type { SponserProfileService } from '../interface/sponser-profile.service.interface'

@Injectable()
export class SponserProfileServiceImpl implements SponserProfileService {
  constructor(
    @Inject('ImageStorageService')
    private readonly imageStorageService: ImageStorageService,
    @Inject('SponserService')
    private readonly sponserService: SponserService<Sponser>
  ) {}

  async upsertProfile(
    image: Express.Multer.File,
    sponserId: number
  ): Promise<string> {
    try {
      const { profileImgUrl } = await this.sponserService.getSponser(sponserId)

      if (profileImgUrl) {
        await this.imageStorageService.deleteObject(profileImgUrl)
      }

      const { url } = await this.imageStorageService.uploadObject(
        image,
        `sponser/${sponserId}/profile`
      )

      await this.sponserService.updateSponser(sponserId, {
        profileImgUrl: url
      })

      return url
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }

      throw new UnexpectedException(error, error.stack)
    }
  }
}
