import { Injectable } from '@nestjs/common'
import {
  ConflictFoundException,
  EntityNotExistException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type TeamLeague } from '@prisma/client'
import type { RegisterTeamLeagueService } from '../interface/register-team-league.service.interface'

/**
 * 팀과 리그의 연결 정보를 생성하는 서비스 인터페이스 [RegisterTeamLeagueService] 구현체
 */
@Injectable()
export class RegisterTeamLeagueServiceImpl
  implements RegisterTeamLeagueService<TeamLeague>
{
  constructor(private readonly prismaService: PrismaService) {}

  async registerTeamLeague(
    teamId: number,
    leagueId: number
  ): Promise<TeamLeague> {
    try {
      return await this.prismaService.teamLeague.create({
        data: {
          teamId,
          leagueId
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictFoundException('teamId and leagueId')
        }
        if (error.code === 'P2025' || error.code === 'P2003') {
          throw new EntityNotExistException('teamId or leagueId')
        }
      }
      throw new UnexpectedException(error)
    }
  }
}
