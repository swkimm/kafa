import { Inject, Injectable } from '@nestjs/common'
import {
  BusinessException,
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { BadRequestException } from '@/common/exception/custom-http-exception'
import { PrismaService } from '@/prisma/prisma.service'
import { ImageStorageService } from '@/storage/interface/image-storage.service.interface'
import { Prisma } from '@prisma/client'
import type { RosterProfileService } from '../interface/roster-profile.service.interface'

@Injectable()
export class RosterProfileServiceImpl implements RosterProfileService {
  constructor(
    @Inject('ImageStorageService')
    private readonly imageStorageService: ImageStorageService,
    private readonly prismaService: PrismaService
  ) {}

  async upsertProfile(
    image: Express.Multer.File,
    rosterId: number
  ): Promise<string> {
    try {
      const { profileImgUrl } =
        await this.prismaService.roster.findUniqueOrThrow({
          where: {
            id: rosterId
          },
          select: {
            profileImgUrl: true
          }
        })

      if (profileImgUrl) {
        await this.imageStorageService.deleteObject(profileImgUrl)
      }

      const { url } = await this.imageStorageService.uploadObject(
        image,
        `roster/${rosterId}/profile`
      )

      await this.prismaService.roster.update({
        where: {
          id: rosterId
        },
        data: {
          profileImgUrl: url
        }
      })

      return url
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }

  async upsertRosterProfile(
    image: Express.Multer.File,
    rosterId: number,
    accountId: number
  ): Promise<string> {
    try {
      const roster = await this.prismaService.roster.findUniqueOrThrow({
        where: {
          id: rosterId
        },
        select: {
          teamId: true
        }
      })

      const account = await this.prismaService.account.findUniqueOrThrow({
        where: {
          id: accountId
        },
        select: {
          teamId: true
        }
      })

      if (roster.teamId !== account.teamId) {
        throw new BadRequestException('다른팀의 로스터는 수정할 수 없습니다')
      }

      return await this.upsertProfile(image, rosterId)
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('로스터가 존재하지 않습니다')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }
}
