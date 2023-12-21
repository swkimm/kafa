import { Inject, Injectable } from '@nestjs/common'
import {
  BusinessException,
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { FileStorageService } from '@/storage/interface/file-storage.service.interface'
import { Prisma, type AccountCertification } from '@prisma/client'
import type { AccountCertificationService } from '../interface/account-certification.service.interface'

@Injectable()
export class AccountCertificationServiceImpl
  implements AccountCertificationService<AccountCertification>
{
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('FileStorageService')
    private readonly fileStorageService: FileStorageService
  ) {}

  async getCertification(accountId: number): Promise<AccountCertification> {
    try {
      return await this.prismaService.accountCertification.findUniqueOrThrow({
        where: {
          accountId
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('account certification')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async upsertCertification(
    file: Express.Multer.File,
    accountId: number
  ): Promise<AccountCertification> {
    try {
      const certificaionExist = await this.checkCertification(accountId)

      if (certificaionExist) {
        const { fileUrl } = await this.getCertification(accountId)
        await this.fileStorageService.deleteObject(fileUrl)
      }

      const { url } = await this.fileStorageService.uploadObject(
        file,
        `secret/account/${accountId}/certificaiton-file`
      )

      return await this.prismaService.accountCertification.upsert({
        where: {
          accountId
        },
        update: {
          fileUrl: url
        },
        create: {
          fileUrl: url,
          accountId
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }

      throw new UnexpectedException(error, error.stack)
    }
  }

  async checkCertification(accountId: number): Promise<boolean> {
    try {
      const certification =
        await this.prismaService.accountCertification.findUnique({
          where: {
            accountId
          }
        })

      return certification ? true : false
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }
}
