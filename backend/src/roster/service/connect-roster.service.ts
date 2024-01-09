import { Inject, Injectable } from '@nestjs/common'
import { AccountService } from '@/account/account.service.interface'
import { AccountCredentialService } from '@/account/interface/account-credential.service.interface'
import {
  BusinessException,
  ConflictFoundException,
  EntityNotExistException,
  ForbiddenAccessException,
  ParameterValidationException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import {
  RosterStatus,
  type AccountCredential,
  Prisma,
  type RosterCredentials,
  RosterType,
  type Roster
} from '@prisma/client'
import type { RequestRosterDTO } from '../dto/create-roster.dto'
import type { RosterWithAthleteDTO } from '../dto/roster-with-athlete.dto'
import type { ConnectRosterService } from '../interface/connect-roster.service.interface'
import { DeleteRosterService } from '../interface/delete-roster.service.interface'
import { GetRosterService } from '../interface/get-roster.service.interface'

@Injectable()
export class ConnectRosterServiceImpl implements ConnectRosterService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('AccountCredentialService')
    private readonly accountCredentialService: AccountCredentialService<AccountCredential>,
    @Inject('AccountService')
    private readonly accountService: AccountService,
    @Inject('GetRosterService')
    private readonly getRosterService: GetRosterService,
    @Inject('DeleteRosterService')
    private readonly deleteRosterService: DeleteRosterService<Roster>
  ) {}

  async getConnectableRosters(
    accountId: number
  ): Promise<RosterWithAthleteDTO[]> {
    try {
      const accountCredential = await this.checkAccountCredential(accountId)

      const connectableRosterIds =
        await this.prismaService.rosterCredentials.findMany({
          where: {
            name: accountCredential.name,
            birthday: accountCredential.birthday,
            gender: accountCredential.gender
          },
          select: {
            rosterId: true
          }
        })

      return await this.prismaService.roster.findMany({
        where: {
          id: {
            in: connectableRosterIds.map(
              (connectableRosterId) => connectableRosterId.rosterId
            )
          },
          status: RosterStatus.Enable,
          Account: null
        },
        select: {
          id: true,
          name: true,
          globalName: true,
          profileImgUrl: true,
          rosterType: true,
          registerYear: true,
          Athlete: {
            select: {
              position: true,
              backNumber: true,
              height: true,
              weight: true
            }
          },
          Team: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true
            }
          }
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async connectRoster(
    accountId: number,
    rosterId: number
  ): Promise<RosterWithAthleteDTO> {
    try {
      const accountCredential = await this.checkAccountCredential(accountId)

      const rosterCredential =
        await this.prismaService.rosterCredentials.findUniqueOrThrow({
          where: {
            rosterId
          }
        })

      this.checkEqualCredential(accountCredential, rosterCredential)

      return await this.prismaService.roster.update({
        where: {
          id: rosterCredential.rosterId,
          status: RosterStatus.Enable,
          Account: null
        },
        data: {
          accountId
        },
        select: {
          id: true,
          name: true,
          globalName: true,
          profileImgUrl: true,
          rosterType: true,
          registerYear: true,
          Athlete: {
            select: {
              position: true,
              backNumber: true,
              weight: true,
              height: true
            }
          },
          Team: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true
            }
          }
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

  async requestCreateRoster(
    accountId: number,
    rosterDTO: RequestRosterDTO
  ): Promise<string> {
    try {
      const accountCredential = await this.checkAccountCredential(accountId)

      this.checkAtheleteInfo(rosterDTO)

      const isDuplicateRequest = await this.checkIsDuplicateRequest(
        accountCredential,
        rosterDTO
      )

      if (isDuplicateRequest) {
        throw new ConflictFoundException(
          '이미 해당 팀에 로스터가 등록되어있거나 중복된 등록 요청이 존재합니다'
        )
      }

      const { globalName, registerYear, rosterType, teamId } = rosterDTO

      const roster = await this.prismaService.roster.create({
        data: {
          name: accountCredential.name,
          registerYear: new Date(`${registerYear}-01-01`),
          rosterType,
          globalName,
          teamId,
          status: RosterStatus.Verifying,
          accountId: accountCredential.accountId,
          RosterCredentials: {
            create: {
              birthday: accountCredential.birthday,
              gender: accountCredential.gender,
              name: accountCredential.name
            }
          }
        }
      })

      if (rosterType === RosterType.Athlete) {
        await this.createAthlete(rosterDTO, roster.id)
      }

      return 'created'
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

  async getCreateRosterRequests(
    managerId: number
  ): Promise<RosterWithAthleteDTO[]> {
    try {
      const { teamId } = await this.accountService.getAccountProfile(managerId)

      return await this.prismaService.roster.findMany({
        where: {
          teamId,
          status: RosterStatus.Verifying
        },
        select: {
          id: true,
          name: true,
          globalName: true,
          profileImgUrl: true,
          rosterType: true,
          registerYear: true,
          Athlete: {
            select: {
              position: true,
              backNumber: true,
              weight: true,
              height: true
            }
          },
          Team: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true
            }
          }
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async approveCreateRosterRequest(
    rosterId: number,
    managerId: number
  ): Promise<string> {
    try {
      const roster = await this.getRosterService.getRoster(rosterId)

      const validAccess = await this.accountService.checkTeamAccount(
        managerId,
        roster.Team.id
      )

      if (!validAccess) {
        throw new ForbiddenAccessException(
          '다른 팀의 로스터에는 접근할 수 없습니다'
        )
      }

      const isProcessable = await this.checkIsProcessableRoster(rosterId)

      if (!isProcessable) {
        throw new ConflictFoundException('이미 처리 완료된 요청입니다')
      }

      await this.prismaService.roster.update({
        where: {
          id: rosterId
        },
        data: {
          status: RosterStatus.Enable
        }
      })

      return 'success'
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async rejectCreateRosterRequest(
    rosterId: number,
    managerId: number
  ): Promise<string> {
    try {
      const roster = await this.getRosterService.getRoster(rosterId)

      const validAccess = await this.accountService.checkTeamAccount(
        managerId,
        roster.Team.id
      )

      if (!validAccess) {
        throw new ForbiddenAccessException(
          '다른 팀의 로스터에는 접근할 수 없습니다'
        )
      }

      const isProcessable = await this.checkIsProcessableRoster(rosterId)

      if (!isProcessable) {
        throw new ConflictFoundException('이미 처리 완료된 요청입니다')
      }

      await this.deleteRosterService.deleteRoster(rosterId, managerId)

      return 'success'
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  /**
   * 중복된 로스터 등록 요청인지 여부를 반환합니다
   *
   * @param {AccountCredential} accountCredential - 현재 로그인한 계정의 개인 정보
   * @param {RequestRosterDTO} rosterDTO - 로스터 등록 요청 정보가 담긴 객체
   * @returns {Promise<boolean>} 중복된 요청일 경우 true를 반환합니다.
   */
  private async checkIsDuplicateRequest(
    accountCredential: AccountCredential,
    rosterDTO: RequestRosterDTO
  ): Promise<boolean> {
    const { name, birthday, gender } = accountCredential

    const roster = await this.prismaService.roster.findFirst({
      where: {
        teamId: rosterDTO.teamId,
        RosterCredentials: {
          name,
          birthday,
          gender
        }
      },
      select: {
        id: true,
        RosterCredentials: {
          select: {
            name: true,
            gender: true,
            birthday: true
          }
        }
      }
    })

    return roster ? true : false
  }

  private async checkIsProcessableRoster(rosterId: number): Promise<boolean> {
    const roster = await this.prismaService.roster.findUnique({
      where: {
        id: rosterId
      },
      select: {
        status: true
      }
    })

    return roster.status === RosterStatus.Verifying
  }

  /**
   * 특정 계정의 개인 정보를 반환합니다.
   *
   * @param {number} accountId - 개인 정보를 확인할 계정의 Id
   * @returns {Promise<AccountCredential>}
   * @throws {EntityNotExistException} 개인 인증 정보가 존재하지 않는 계정의 Id를 전달할 경우 발생
   */
  private async checkAccountCredential(
    accountId: number
  ): Promise<AccountCredential> {
    const credentialExist =
      await this.accountCredentialService.checkCredential(accountId)

    if (!credentialExist) {
      throw new ForbiddenAccessException(
        '개인정보 인증이 완료되지 않은 계정입니다'
      )
    }

    return await this.accountCredentialService.getCredential(accountId)
  }

  /**
   * 로스터와 계정의 개인 정보가 일치하는지 검사합니다.
   *
   * @param {AccountCredential} accountCredential - 개인 정보 일치 여부를 확인할 계정의 개인 정보
   * @param {RosterCredentials} rosterCredential - 개인 정보 일치 여부를 확인할 로스터의 개인 정보
   * @returns {void}
   * @throws {ForbiddenAccessException} 개인 정보가 일치하지 않을 경우 발생
   */
  private checkEqualCredential(
    accountCredential: AccountCredential,
    rosterCredential: RosterCredentials
  ): void {
    if (
      accountCredential.name !== rosterCredential.name ||
      accountCredential.birthday.getTime() !==
        rosterCredential.birthday.getTime() ||
      accountCredential.gender !== rosterCredential.gender
    ) {
      throw new ForbiddenAccessException('cannot connect other people roster')
    }
  }

  /**
   * 로스터에 선수 정보를 추가합니다.
   *
   * @param {RequestRosterDTO} rosterDTO - 생성할 선수 정보가 담긴 객체
   * @param {number} rosterId - 선수 정보를 생성할 로스터의 Id
   * @returns {Promise<void>}
   */
  private async createAthlete(
    rosterDTO: RequestRosterDTO,
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
   * @param {RequestRosterDTO} rosterDTO - 검사할 로스터 생성 정보 객체
   * @returns {void}
   * @throws {ParameterValidationException} 유효하지 않은 값 또는 필수 값이 누락된 경우 발생
   */
  private checkAtheleteInfo(rosterDTO: RequestRosterDTO): void {
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
