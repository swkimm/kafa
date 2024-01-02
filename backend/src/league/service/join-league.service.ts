import { Inject, Injectable } from '@nestjs/common'
import { AccountService } from '@/account/account.service.interface'
import { AccountCertificationService } from '@/account/interface/account-certification.service.interface'
import { AccountCredentialService } from '@/account/interface/account-credential.service.interface'
import {
  BusinessException,
  ConflictFoundException,
  UnexpectedException,
  UnprocessableDataException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { RosterService } from '@/roster/abstract/roster.service'
import type { Position } from '@/roster/types/position.type'
import { TeamLeagueService } from '@/team-league/abstract/team-league.service'
import {
  RosterType,
  type AccountCertification,
  type TeamLeague,
  RosterStatus,
  LeagueApplyStatus,
  type AccountCredential,
  type Roster,
  type Prisma
} from '@prisma/client'
import type { LeagueWithAssociationDTO } from '../dto/league-with-association.dto'
import {
  RegisterLeagueAvaliabilityDTO,
  TeamRosterWithSensitiveInfoDTO,
  type RosterWithAvaliability,
  type RosterWithCredentialsAndCertifications
} from '../dto/register-league-availability.dto'
import type { JoinLeagueService } from '../interface/join-league.service.interface'
import { RosterAccountCredentialStatus } from '../types/rosterAccountCredentialStatus.type'

/**
 * 추상 클래스 'JoinLeagueService'의 구현체
 */
@Injectable()
export class JoinLeagueServiceImpl implements JoinLeagueService<TeamLeague> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('AccountService') private readonly accountService: AccountService,
    @Inject('AccountCertificationService')
    private readonly accountCertificationService: AccountCertificationService<AccountCertification>,
    @Inject('AccountCredentialService')
    private readonly accountCredentialService: AccountCredentialService<AccountCredential>,
    @Inject('TeamLeagueService')
    private readonly teamLeagueService: TeamLeagueService<TeamLeague>,
    @Inject('RosterService')
    private readonly rosterService: RosterService<Roster>
  ) {}

  async requestJoinLeague(
    leagueId: number,
    managerId: number
  ): Promise<TeamLeague> {
    try {
      const { teamId } = await this.accountService.getAccountProfile(managerId)

      const { valid: isValidRosters } =
        await this.checkTeamRosterCertifications(managerId)

      if (!isValidRosters) {
        throw new UnprocessableDataException(
          '팀에 유효하지 않은 로스터가 포함되어있습니다. 로스터 상태를 확인해주세요'
        )
      }

      return await this.teamLeagueService.registerTeamLeague(teamId, leagueId)
    } catch (error) {
      if (error instanceof BusinessException) {
        if (error instanceof ConflictFoundException) {
          throw new ConflictFoundException(
            '이미 해당 리그에 참가를 요청했습니다'
          )
        }
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async checkTeamRosterCertifications(
    managerId: number
  ): Promise<RegisterLeagueAvaliabilityDTO> {
    try {
      const { teamId } = await this.accountService.getAccountProfile(managerId)

      const checkResult = new RegisterLeagueAvaliabilityDTO()

      const rosters = await this.prismaService.roster.findMany({
        where: {
          teamId,
          status: RosterStatus.Enable
        },
        select: {
          name: true,
          profileImgUrl: true,
          accountId: true,
          rosterType: true,
          Athlete: {
            select: {
              position: true,
              backNumber: true
            }
          }
        },
        orderBy: {
          Athlete: {
            backNumber: 'asc'
          }
        }
      })

      for (const roster of rosters) {
        let avaliability: RosterAccountCredentialStatus

        if (roster.rosterType === RosterType.Athlete) {
          const accountCertificationExist = roster.accountId
            ? await this.accountCertificationService.checkCertification(
                roster.accountId
              )
            : false

          avaliability = accountCertificationExist
            ? (roster['certification'] = RosterAccountCredentialStatus.Verified)
            : (roster['certification'] =
                RosterAccountCredentialStatus.Unverified)
        } else {
          avaliability = RosterAccountCredentialStatus.Exemption
        }

        checkResult.rosters.push({
          name: roster.name,
          profileImgUrl: roster.profileImgUrl,
          rosterType: roster.rosterType,
          position: roster.Athlete?.position as Position,
          backNumber: roster.Athlete?.backNumber,
          avaliability
        })
      }

      const isUniqueBackNumber = this.checkUniqueBackNumber(checkResult.rosters)

      if (!isUniqueBackNumber) {
        checkResult.valid = false
        checkResult.reasons.push('로스터 명단에 중복된 등번호가 존재합니다')
      }

      this.validateRosterAccountCredentialExist(checkResult)

      return checkResult
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async approveRegisterLeague(
    teamId: number,
    leagueId: number
  ): Promise<TeamLeague> {
    try {
      const rosters = await this.rosterService.getTeamRosters(
        teamId,
        1,
        100,
        'Enable'
      )

      const approvedRosters: Prisma.LeagueRosterCreateManyInput[] = rosters.map(
        (roster) => {
          return { rosterId: roster.id, leagueId }
        }
      )

      await this.prismaService.leagueRoster.createMany({
        data: approvedRosters
      })

      return await this.teamLeagueService.updateTeamLeague({
        teamId,
        leagueId,
        applyStatus: LeagueApplyStatus.Approved
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stackß)
    }
  }

  async rejectRegisterLeague(
    teamId: number,
    leagueId: number,
    reason: string,
    type = LeagueApplyStatus.Hold
  ): Promise<TeamLeague> {
    try {
      const teamLeague = await this.teamLeagueService.getTeamLeague(
        teamId,
        leagueId
      )

      if (teamLeague.applyStatus === LeagueApplyStatus.Approved) {
        throw new ConflictFoundException('이미 참여가 승인된 팀입니다')
      }

      return await this.teamLeagueService.updateTeamLeague({
        teamId,
        leagueId,
        applyStatus: type,
        rejectReason: reason
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stackß)
    }
  }

  async getJoinableLeagues(limit = 10): Promise<LeagueWithAssociationDTO[]> {
    try {
      return await this.prismaService.league.findMany({
        where: {
          startedAt: {
            gt: new Date()
          }
        },
        orderBy: {
          startedAt: 'desc'
        },
        take: limit,
        select: {
          id: true,
          name: true,
          startedAt: true,
          endedAt: true,
          Association: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true
            }
          }
        }
      })
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getJoinLeagueRequests(leagueId: number): Promise<TeamLeague[]> {
    try {
      return await this.teamLeagueService.getTeamLeaguesByLeagueId(
        leagueId,
        'Received'
      )
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getTeamJoinLeagueRequests(managerId: number): Promise<TeamLeague[]> {
    try {
      const { teamId } = await this.accountService.getAccountProfile(managerId)

      const holded = await this.teamLeagueService.getTeamLeaguesByTeamId(
        teamId,
        'Hold'
      )

      const received = await this.teamLeagueService.getTeamLeaguesByTeamId(
        teamId,
        'Received'
      )

      return holded.concat(received)
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getLeagueJoinRequestWithRosterAndCredentials(
    teamId: number,
    leagueId: number
  ): Promise<TeamRosterWithSensitiveInfoDTO> {
    try {
      const { rejectReason } = await this.teamLeagueService.getTeamLeague(
        teamId,
        leagueId
      )

      const requestInfo = new TeamRosterWithSensitiveInfoDTO()

      requestInfo.rejectReason = rejectReason

      const rosters = await this.prismaService.roster.findMany({
        where: {
          teamId,
          status: RosterStatus.Enable
        },
        select: {
          name: true,
          profileImgUrl: true,
          accountId: true,
          rosterType: true,
          Athlete: {
            select: {
              position: true,
              backNumber: true
            }
          }
        },
        orderBy: {
          Athlete: {
            backNumber: 'asc'
          }
        }
      })

      for (const roster of rosters) {
        const rosterInfo: RosterWithCredentialsAndCertifications = {
          name: roster.name,
          profileImgUrl: roster.profileImgUrl,
          rosterType: roster.rosterType,
          position: roster.Athlete?.position as Position,
          backNumber: roster.Athlete?.backNumber
        }

        if (roster.rosterType === RosterType.Athlete) {
          const accountCredential =
            await this.accountCredentialService.getCredential(roster.accountId)
          const accountCertification =
            await this.accountCertificationService.getCertification(
              roster.accountId
            )

          rosterInfo['gender'] = accountCredential.gender
          rosterInfo['birthday'] = accountCredential.birthday
          rosterInfo['certificationUrl'] = accountCertification.fileUrl
        }

        requestInfo.rosters.push(rosterInfo)
      }

      return requestInfo
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async retryJoinLeague(
    leagueId: number,
    managerId: number
  ): Promise<TeamLeague> {
    try {
      const { teamId } = await this.accountService.getAccountProfile(managerId)

      const teamLeague = await this.teamLeagueService.getTeamLeague(
        leagueId,
        teamId
      )

      if (teamLeague.applyStatus !== 'Hold') {
        throw new ConflictFoundException('이미 처리가 완료된 요청입니다')
      }

      const { valid: isValidRosters } =
        await this.checkTeamRosterCertifications(managerId)

      if (!isValidRosters) {
        throw new UnprocessableDataException(
          '팀에 유효하지 않은 로스터가 포함되어있습니다. 로스터 상태를 확인해주세요'
        )
      }

      return await this.teamLeagueService.updateTeamLeague({
        teamId,
        leagueId,
        applyStatus: LeagueApplyStatus.Received
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  /**
   * 전달받은 로스터 목록에서 각 로스터에 해당하는 증명서가 존재하는지 여부를 검사하고,
   * 없을 경우 해당 로스터 정보를 전달받은 로스터 객체에 추가합니다
   *
   * @param {RegisterLeagueAvaliabilityDTO} rosterDTO - 검사할 로스터 목록
   * @returns {void}
   */
  private validateRosterAccountCredentialExist(
    rosterDTO: RegisterLeagueAvaliabilityDTO
  ): void {
    for (const roster of rosterDTO.rosters) {
      if (
        roster.rosterType === RosterType.Athlete &&
        roster.avaliability === RosterAccountCredentialStatus.Unverified
      ) {
        rosterDTO.valid = false
        rosterDTO.reasons.push(
          `#${roster.backNumber} ${roster.name} 선수의 개인 증명 정보가 업로드 되지 않았습니다`
        )
      }
    }
  }

  /**
   * 전달한 로스터 목록에 중복되는 등번호가 존재하는지 여부를 반환합니다
   *
   * @param {RosterWithAvaliability} rosters - 검사할 로스터 목록
   * @returns {boolean} 'true' 중복 없음 | 'false' 중복 존재
   */
  private checkUniqueBackNumber(rosters: RosterWithAvaliability[]): boolean {
    const numberSet = new Set<number>()

    for (const roster of rosters) {
      if (roster.rosterType === RosterType.Athlete) {
        if (numberSet.has(roster.backNumber)) {
          return false
        }
        numberSet.add(roster.backNumber)
      }
    }

    return true
  }
}
