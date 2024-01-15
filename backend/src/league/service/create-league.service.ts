import { Injectable } from '@nestjs/common'
import {
  BusinessException,
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, type League } from '@prisma/client'
import type { CreateLeagueDTO } from '../dto/create-league.dto'
import type { CreateLeagueService } from '../interface/create-league.service.interface'

/**
 * 리그 생성과 관련된 서비스 인터페이스 [CreateLeagueService] 구현체
 */
@Injectable()
export class CreateLeagueServiceImpl implements CreateLeagueService<League> {
  constructor(private readonly prismaService: PrismaService) {}

  async createLeague(leagueDTO: CreateLeagueDTO): Promise<League> {
    try {
      this.checkDate(leagueDTO)

      return await this.prismaService.league.create({
        data: {
          ...leagueDTO,
          startedYear: leagueDTO.startedAt.getFullYear()
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new EntityNotExistException('associationId')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  /**
   * 리그의 시작 종료 날짜 유효성을 검사하는 private 메서드
   *
   * @param {CreateLeagueDTO} leagueDTO
   * @return {void}
   * @throws {ParameterValidationException} 유효하지 않은 시작 종료 날짜를 전달한 경우 발생
   */
  private checkDate(leagueDTO: CreateLeagueDTO): void {
    if (leagueDTO.startedAt.getTime() > leagueDTO.endedAt.getTime()) {
      throw new ParameterValidationException('ended date')
    }
  }
}
