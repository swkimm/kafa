import { Injectable } from '@nestjs/common'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, TeamStatus } from '@prisma/client'
import type { DeleteTeamService } from '../interface/delete-team.service.interface'

@Injectable()
export class DeleteTeamServiceImpl
  implements DeleteTeamService<{ result: string }>
{
  constructor(private readonly prismaService: PrismaService) {}

  async deleteTeam(teamId: number): Promise<{ result: string }> {
    try {
      await this.prismaService.team.update({
        where: {
          id: teamId
        },
        data: {
          status: TeamStatus.Disabled,
          deletedAt: new Date()
        }
      })

      return { result: 'ok' }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('teamId')
      } else {
        throw new UnexpectedException(error)
      }
    }
  }
}
