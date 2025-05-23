import { Inject, Injectable } from '@nestjs/common'
import { AccountService } from '@/account/account.service.interface'
import {
  BusinessException,
  EntityNotExistException,
  ForbiddenAccessException,
  ParameterValidationException,
  UnexpectedException,
  UnprocessableDataException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, RosterType } from '@prisma/client'
import type { RosterWithAthleteSimpleDTO } from '../dto/roster-with-athlete.dto'
import type { UpdateRosterDTO } from '../dto/update-roster.dto'
import { GetRosterService } from '../interface/get-roster.service.interface'
import type { RosterCredentialDTO } from '../interface/roster-credential.dto'
import type { UpdateRosterService } from '../interface/update-roster.interface'

@Injectable()
export class UpdateRosterServiceImpl implements UpdateRosterService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('GetRosterService')
    private readonly getRosterService: GetRosterService,
    @Inject('AccountService')
    private readonly accountService: AccountService
  ) {}

  async updateRoster(
    rosterDTO: UpdateRosterDTO,
    rosterId: number,
    accountId: number
  ): Promise<RosterWithAthleteSimpleDTO> {
    try {
      this.checkRosterDTO(rosterDTO)

      const roster = await this.getRosterService.getRoster(rosterId)

      const validAccess = await this.accountService.checkTeamAccount(
        accountId,
        roster.Team.id
      )

      if (!validAccess) {
        throw new ForbiddenAccessException('cannot access another team')
      }

      if (rosterDTO.rosterType === RosterType.Athlete) {
        return await this.prismaService.roster.update({
          where: {
            id: rosterId
          },
          data: {
            name: rosterDTO.name,
            globalName: rosterDTO.globalName,
            registerYear: new Date(`${rosterDTO.registerYear}-01-03`),
            rosterType: rosterDTO.rosterType,
            status: rosterDTO.status,
            Athlete: {
              connectOrCreate: {
                where: {
                  rosterId
                },
                create: {
                  position: rosterDTO.position,
                  backNumber: rosterDTO.backNumber,
                  height: rosterDTO.height,
                  weight: rosterDTO.weight
                }
              }
            }
          },
          select: {
            id: true,
            name: true,
            globalName: true,
            profileImgUrl: true,
            rosterType: true,
            registerYear: true,
            status: true,
            Athlete: {
              select: {
                position: true,
                backNumber: true
              }
            }
          }
        })
      } else {
        if (roster.rosterType === RosterType.Athlete) {
          await this.prismaService.athlete.delete({
            where: {
              rosterId
            }
          })
        }

        return await this.prismaService.roster.update({
          where: {
            id: rosterId
          },
          data: {
            name: rosterDTO.name,
            globalName: rosterDTO.globalName,
            registerYear: new Date(`${rosterDTO.registerYear}-01-03`),
            rosterType: rosterDTO.rosterType,
            status: rosterDTO.status
          },
          select: {
            id: true,
            name: true,
            globalName: true,
            profileImgUrl: true,
            rosterType: true,
            registerYear: true,
            status: true,
            Athlete: {
              select: {
                position: true,
                backNumber: true
              }
            }
          }
        })
      }
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async updateRosterCredential(
    managerId: number,
    rosterId: number,
    credential: RosterCredentialDTO
  ): Promise<RosterCredentialDTO> {
    try {
      const roster = await this.prismaService.roster.findUniqueOrThrow({
        where: {
          id: rosterId
        }
      })

      const validAccess = await this.accountService.checkTeamAccount(
        managerId,
        roster.teamId
      )

      if (!validAccess) {
        throw new ForbiddenAccessException(
          '다른팀의 로스터는 수정할 수 없습니다'
        )
      }

      if (roster.accountId)
        throw new UnprocessableDataException('이미 계정에 연결된 로스터입니다')

      return await this.prismaService.rosterCredentials.update({
        where: {
          rosterId
        },
        data: {
          ...credential
        },
        select: {
          name: true,
          birthday: true,
          gender: true
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
        throw new EntityNotExistException('로스터가 존재하지 않습니다')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  /**
   * 로스터 업데이트 정보 객체의 값들이 누락되지 않고 유효한 값들로 구성되었는지 검사합니다.
   *
   * @param {CreateRosterDTO} rosterDTO - 검사할 로스터 생성 정보 객체
   * @returns {void}
   * @throws {ParameterValidationException} 유효하지 않은 값 또는 필수 값이 누락된 경우 발생
   */
  private checkRosterDTO(rosterDTO: UpdateRosterDTO): void {
    if (rosterDTO.rosterType === RosterType.Athlete) {
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
}
