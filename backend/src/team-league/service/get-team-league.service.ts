import { Injectable } from '@nestjs/common'
import {
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type TeamLeague } from '@prisma/client'
import type { GetTeamLeagueService } from '../interface/get-team-league.service.interface'

@Injectable()
export class GetTeamLeagueServiceImpl
  implements GetTeamLeagueService<TeamLeague>
{
  constructor(private readonly prismaService: PrismaService) {}

  async getTeamLeaguesByLeagueId(leagueId: number): Promise<TeamLeague[]> {
    try {
      await this.checkLeagueId(leagueId)
      return await this.prismaService.teamLeague.findMany({
        where: {
          leagueId
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('leagueId')
      }
      throw new UnexpectedException(error)
    }
  }

  async getTeamLeaguesByTeamId(teamId: number): Promise<TeamLeague[]> {
    try {
      await this.checkTeamId(teamId)
      return await this.prismaService.teamLeague.findMany({
        where: {
          teamId
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('teamId')
      }
      throw new UnexpectedException(error)
    }
  }

  private async checkLeagueId(leagueId: number): Promise<void> {
    await this.prismaService.league.findUniqueOrThrow({
      where: {
        id: leagueId
      }
    })
  }

  private async checkTeamId(teamId: number): Promise<void> {
    await this.prismaService.team.findUniqueOrThrow({
      where: {
        id: teamId
      }
    })
  }
}
