import { Inject, Injectable } from '@nestjs/common'
import {
  BusinessException,
  EntityNotExistException,
  UnexpectedException,
  UnverifiedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { FileStorageService } from '@/storage/interface/file-storage.service.interface'
import {
  Prisma,
  type AccountCertification,
  type AccountCredential,
  Role
} from '@prisma/client'
import type { AccountCertificateStatus } from '../dto/accountStatus.dto'
import type { AccountCertificationService } from '../interface/account-certification.service.interface'
import { AccountCredentialService } from '../interface/account-credential.service.interface'

@Injectable()
export class AccountCertificationServiceImpl
  implements AccountCertificationService<AccountCertification>
{
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('FileStorageService')
    private readonly fileStorageService: FileStorageService,
    @Inject('AccountCredentialService')
    private readonly accountCredentialService: AccountCredentialService<AccountCredential>
  ) {}

  async getCertification(accountId: number): Promise<AccountCertification> {
    try {
      return await this.prismaService.accountCertification.findUniqueOrThrow({
        where: {
          accountId,
          Account: {
            role: Role.User
          }
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
      const credentialExist =
        await this.accountCredentialService.checkCredential(accountId)

      if (!credentialExist) {
        throw new UnverifiedException('account credential')
      }

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
          accountId,
          Account: {
            role: Role.User
          }
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
            accountId,
            Account: {
              role: Role.User
            }
          }
        })

      return certification ? true : false
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }

  async checkAccountStatus(
    accountId: number
  ): Promise<AccountCertificateStatus> {
    try {
      const account = await this.prismaService.account.findUniqueOrThrow({
        where: {
          id: accountId
        },
        select: {
          status: true
        }
      })

      const certification = await this.checkCertification(accountId)

      const credential =
        await this.accountCredentialService.checkCredential(accountId)

      return {
        certification,
        credential,
        email: account.status === 'Enable'
      }
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('계정이 존재하지 않습니다')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }
}
