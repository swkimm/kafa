import { Inject, Injectable } from '@nestjs/common'
import { AccountService } from '@/account/account.service.interface'
import {
  BusinessException,
  EntityNotExistException,
  ForbiddenAccessException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type Roster } from '@prisma/client'
import type { DeleteRosterService } from '../interface/delete-roster.service.interface'
import { GetRosterService } from '../interface/get-roster.service.interface'

@Injectable()
export class DeleteRosterServiceImpl implements DeleteRosterService<Roster> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('GetRosterService')
    private readonly getRosterService: GetRosterService,
    @Inject('AccountService')
    private readonly accountService: AccountService
  ) {}

  async deleteRoster(rosterId: number, accountId: number): Promise<Roster> {
    try {
      const roster = await this.getRosterService.getRoster(rosterId)

      const validAccess = await this.accountService.checkTeamAccount(
        accountId,
        roster.Team.id
      )

      if (!validAccess) {
        throw new ForbiddenAccessException(
          '다른 팀의 로스터는 삭제할 수 없습니다'
        )
      }

      return await this.prismaService.roster.delete({
        where: {
          id: rosterId
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('rosterId')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }
}
