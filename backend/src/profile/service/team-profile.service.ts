import { Inject, Injectable } from '@nestjs/common'
import { AccountService } from '@/account/account.service.interface'
import {
  BusinessException,
  ForbiddenAccessException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { ImageStorageService } from '@/storage/interface/image-storage.service.interface'
import { TeamService } from '@/team/abstract/team.service'
import { Role, type RegisterTeamRequest, type Team } from '@prisma/client'
import type { TeamProfileService } from '../interface/\bteam-profile.service.interface'

@Injectable()
export class TeamProfileServiceImpl implements TeamProfileService {
  constructor(
    @Inject('ImageStorageService')
    private readonly imageStorageService: ImageStorageService,
    @Inject('TeamService')
    private readonly teamService: TeamService<
      Team,
      { result: string },
      RegisterTeamRequest
    >,
    @Inject('AccountService')
    private readonly accountService: AccountService,
    private readonly prismaService: PrismaService
  ) {}

  async upsertProfile(
    image: Express.Multer.File,
    teamId: number
  ): Promise<string> {
    try {
      const { profileImgUrl } = await this.teamService.getTeam(teamId)

      if (profileImgUrl) {
        await this.imageStorageService.deleteObject(profileImgUrl)
      }

      const { url } = await this.imageStorageService.uploadObject(
        image,
        `team/${teamId}/profile`
      )

      await this.prismaService.team.update({
        where: {
          id: teamId
        },
        data: {
          profileImgUrl: url
        }
      })

      return url
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async upsertTeamProfile(
    image: Express.Multer.File,
    teamId: number,
    accountId: number
  ): Promise<string> {
    try {
      const { role } = await this.accountService.getAccountRole(accountId)

      if (role !== Role.Admin) {
        const { teamId: accountTeamId } =
          await this.accountService.getAccountProfile(accountId)

        if (!teamId || teamId !== accountTeamId) {
          throw new ForbiddenAccessException('cannot access another team')
        }
      }

      return await this.upsertProfile(image, teamId)
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }

      throw new UnexpectedException(error, error.stack)
    }
  }
}
