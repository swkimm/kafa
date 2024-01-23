import { Inject, Injectable } from '@nestjs/common'
import { AccountService } from '@/account/account.service.interface'
import {
  BusinessException,
  EntityNotExistException,
  ForbiddenAccessException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { RosterType, Prisma, RosterStatus } from '@prisma/client'
import type { CreateRosterDTO } from '../dto/create-roster.dto'
import type { RosterWithCredentialDTO } from '../dto/roster-with-credential.dto'
import type { CreateRosterService } from '../interface/create-roster.service.interface'

@Injectable()
export class CreateRosterServiceImpl implements CreateRosterService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('AccountService')
    private readonly accountService: AccountService
  ) {}

  async createRoster(
    rosterDTO: CreateRosterDTO,
    accountId: number
  ): Promise<RosterWithCredentialDTO> {
    try {
      this.checkAtheleteInfo(rosterDTO)

      const checkTeam = await this.accountService.checkTeamAccount(
        accountId,
        rosterDTO.teamId
      )

      if (!checkTeam) {
        throw new ForbiddenAccessException('cannot access another team')
      }

      const {
        name,
        globalName,
        registerYear,
        rosterType,
        teamId,
        birthday,
        gender
      } = rosterDTO

      const roster = await this.prismaService.roster.create({
        data: {
          name,
          registerYear: new Date(`${registerYear}-01-01`),
          rosterType,
          globalName,
          teamId,
          status: RosterStatus.Enable,
          RosterCredentials: {
            create: {
              birthday,
              gender,
              name
            }
          }
        },
        select: {
          id: true,
          name: true,
          profileImgUrl: true,
          rosterType: true,
          status: true,
          RosterCredentials: {
            select: {
              name: true,
              birthday: true,
              gender: true
            }
          }
        }
      })

      if (rosterType === RosterType.Athlete) {
        await this.createAthlete(rosterDTO, roster.id)
      }

      return roster
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new EntityNotExistException('teamId')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  /**
   * 로스터에 선수 정보를 추가합니다.
   *
   * @param {CreateRosterDTO} rosterDTO - 생성할 선수 정보가 담긴 객체
   * @param {number} rosterId - 선수 정보를 생성할 로스터의 Id
   * @returns {Promise<void>}
   */
  private async createAthlete(
    rosterDTO: CreateRosterDTO,
    rosterId: number
  ): Promise<void> {
    try {
      const { backNumber, height, weight, position } = rosterDTO

      await this.prismaService.athlete.create({
        data: {
          rosterId,
          backNumber,
          height,
          weight,
          position
        }
      })
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }

  /**
   * 로스터 생성 정보 객체의 값들이 누락되지 않고 유효한 값들로 구성되었는지 검사합니다.
   *
   * @param {CreateRosterDTO} rosterDTO - 검사할 로스터 생성 정보 객체
   * @returns {void}
   * @throws {ParameterValidationException} 유효하지 않은 값 또는 필수 값이 누락된 경우 발생
   */
  private checkAtheleteInfo(rosterDTO: CreateRosterDTO): void {
    if (rosterDTO.rosterType !== RosterType.Athlete) return

    if (!rosterDTO.position) {
      throw new ParameterValidationException('position field is empty')
    }

    if (!rosterDTO.backNumber) {
      throw new ParameterValidationException('backNumber field is empty')
    }

    if (!rosterDTO.height) {
      throw new ParameterValidationException('height field is empty')
    }

    if (!rosterDTO.weight) {
      throw new ParameterValidationException('weight field is empty')
    }

    if (
      rosterDTO.position &&
      !(
        rosterDTO.position.defense ||
        rosterDTO.position.offence ||
        rosterDTO.position.special
      )
    ) {
      throw new ParameterValidationException(
        'should pass at least one position'
      )
    }
  }
}
