import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import type { Account } from '@prisma/client'

@Injectable()
export class AccountService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateLastLogin(username: string): Promise<void> {
    await this.prismaService.account.update({
      where: { username },
      data: { lastLogin: new Date() }
    })
  }

  async getUserCredential(username: string): Promise<Account> {
    return await this.prismaService.account.findUnique({
      where: { username }
    })
  }
}
