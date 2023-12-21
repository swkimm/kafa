import { Injectable } from '@nestjs/common'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type AccountCredential } from '@prisma/client'
import type { AccountCredentialService } from '../interface/account-credential.service.interface'

@Injectable()
export class AccountCredentialServiceImpl
  implements AccountCredentialService<AccountCredential>
{
  constructor(private readonly prismaService: PrismaService) {}

  async getCredential(accountId: number): Promise<AccountCredential> {
    try {
      return await this.prismaService.accountCredential.findUniqueOrThrow({
        where: {
          accountId
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('accountId')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async checkCredential(accountId: number): Promise<boolean> {
    try {
      const credential = await this.prismaService.accountCredential.findUnique({
        where: {
          accountId
        }
      })

      return credential ? true : false
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }
}
