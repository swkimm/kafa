import {
  BadRequestException,
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthenticatedRequest } from '@/common/class/authenticated-request.interface'
import { Roles } from '@/common/decorator/roles.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import { IMAGE_OPTIONS } from '@/storage/option/image-option'
import { Role } from '@prisma/client'
import { TeamProfileService } from './interface/\bteam-profile.service.interface'
import { AccountProfileService } from './interface/account-profile.service.interface'
import { SponserProfileService } from './interface/sponser-profile.service.interface'

@Controller('profile')
export class ProfileController {
  constructor(
    @Inject('AccountProfileService')
    private readonly accountProfileService: AccountProfileService,
    @Inject('TeamProfileService')
    private readonly teamProfileService: TeamProfileService,
    @Inject('SponserProfileService')
    private readonly sponserProfileService: SponserProfileService
  ) {}

  @Post('account')
  @UseInterceptors(FileInterceptor('image', IMAGE_OPTIONS))
  async upsertMyAccountProfile(
    @UploadedFile() image: Express.Multer.File,
    @Req() req: AuthenticatedRequest
  ): Promise<string> {
    if (!image) {
      throw new BadRequestException('Invalid image format or size')
    }

    try {
      return await this.accountProfileService.upsertProfile(image, req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Admin)
  @Post('account/:accountId')
  @UseInterceptors(FileInterceptor('image', IMAGE_OPTIONS))
  async upsertOtherAccountProfile(
    @UploadedFile() image: Express.Multer.File,
    @Param('accountId', ParseIntPipe) accountId: number
  ): Promise<string> {
    if (!image) {
      throw new BadRequestException('Invalid image format or size')
    }

    try {
      return await this.accountProfileService.upsertProfile(image, accountId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Manager)
  @Post('team/:teamId')
  @UseInterceptors(FileInterceptor('image', IMAGE_OPTIONS))
  async upsertTeamProfile(
    @UploadedFile() image: Express.Multer.File,
    @Param('teamId', ParseIntPipe) teamId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<string> {
    if (!image) {
      throw new BadRequestException('Invalid image format or size')
    }

    try {
      return await this.teamProfileService.upsertTeamProfile(
        image,
        teamId,
        req.user.id
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Roles(Role.Admin)
  @Post('sponser/:sponserId')
  @UseInterceptors(FileInterceptor('image', IMAGE_OPTIONS))
  async upsertSponserProfile(
    @UploadedFile() image: Express.Multer.File,
    @Param('sponserId', ParseIntPipe) sponserId: number
  ): Promise<string> {
    if (!image) {
      throw new BadRequestException('Invalid image format or size')
    }

    try {
      return await this.sponserProfileService.upsertProfile(image, sponserId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
