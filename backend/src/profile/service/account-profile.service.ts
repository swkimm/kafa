import { Inject, Injectable } from '@nestjs/common'
import { AccountService } from '@/account/account.service.interface'
import {
  BusinessException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { ImageStorageService } from '@/storage/interface/image-storage.service.interface'
import type { AccountProfileService } from '../interface/account-profile.service.interface'

@Injectable()
export class AccountProfileServiceImpl implements AccountProfileService {
  constructor(
    @Inject('AccountService')
    private readonly accountService: AccountService,
    @Inject('ImageStorageService')
    private readonly imageStorageService: ImageStorageService
  ) {}

  async upsertProfile(
    image: Express.Multer.File,
    accountId: number
  ): Promise<string> {
    try {
      const { profileImgUrl } =
        await this.accountService.getAccountProfile(accountId)

      if (profileImgUrl) {
        await this.imageStorageService.deleteObject(profileImgUrl)
      }

      const { url } = await this.imageStorageService.uploadObject(
        image,
        `account/${accountId}/profile`
      )

      await this.accountService.updateAccountProfile(
        { profileImgUrl: url },
        accountId
      )

      return url
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }

      throw new UnexpectedException(error, error.stack)
    }
  }
}
