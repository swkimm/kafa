import type { Roster } from '@prisma/client'
import type {
  CreateRosterDTO,
  RequestRosterDTO
} from '../dto/create-roster.dto'
import type {
  RosterWithAthleteDTO,
  RosterWithAthleteManyDTO
} from '../dto/roster-with-athlete.dto'
import type { UpdateRosterDTO } from '../dto/update-roster.dto'
import type { ConnectRosterService } from '../interface/connect-roster.service.interface'
import type { CreateRosterService } from '../interface/create-roster.service.interface'
import type { DeleteRosterService } from '../interface/delete-roster.service.interface'
import type { GetRosterService } from '../interface/get-roster.service.interface'
import type { UpdateRosterService } from '../interface/update-roster.interface'

/**
 * 로스터를 관리하는 서비스 모음
 * 템플릿 메서드 패턴을 사용하며, [GetRosterService, CreateRosterService, UpdateRosterService, DeleteRosterService, ConnectRosterService] 구현체를 생성자에서 주입받아 사용합니다.
 * @template T - 'Roster' 타입 확장하는 제네릭 타입
 */
export abstract class RosterService<T extends Roster> {
  constructor(
    private readonly getRosterService: GetRosterService,
    private readonly createRosterService: CreateRosterService<T>,
    private readonly deleteRosterService: DeleteRosterService<T>,
    private readonly updateRosterService: UpdateRosterService<T>,
    private readonly connectRosterService: ConnectRosterService
  ) {}

  /**
   * 로스터 정보를 반환합니다.
   *
   * @param {number} rosterId - 정보를 조회할 로스터의 Id
   * @returns {Promise<RosterWithAthleteDTO>} 로스터 정보
   * @throws {EntityNotExistException} 존재하지 않는 로스터의 Id를 전달할 경우 발생
   */
  async getRoster(rosterId: number): Promise<RosterWithAthleteDTO> {
    return await this.getRosterService.getRoster(rosterId)
  }

  /**
   * 특정 팀의 특정 리그에서의 로스터 목록을 반환합니다.
   *
   * @param {number} teamId - 로스터를 조회할 팀의 아이디
   * @param {number} leagueId - 로스터를 조회할 리그의 아이디
   * @return {Promise<RosterWithAthleteManyDTO[]>} 로스터 목록
   * @throws {EntityNotExistException} 존재하지 않는 팀 또는 리그의 Id를 전달할 경우 발생
   */
  async getTeamRostersByLeagueId(
    teamId: number,
    leagueId: number
  ): Promise<RosterWithAthleteManyDTO[]> {
    return await this.getRosterService.getTeamRostersByLeagueId(
      teamId,
      leagueId
    )
  }

  /**
   * 특정 팀의 로스터 목록을 반환합니다.
   *
   * @param {number} teamId - 로스터 목록을 불러올 팀의 Id
   * @param {number} [page=1] - 로스터 목록을 불러올 페이지
   * @param {number} [limit=10] - 한 번에 불러올 로스터 수
   * @param {string} [option=Enable] - 불러올 로스터의 옵션 [Enable|Disable|Graduate]
   * @returns {Promise<RosterWithAthleteManyDTO[]>}
   * @throws {EntityNotExistException} 존재하지 않는 팀의 Id를 전달할 경우 발생
   * @throws {ParameterValidationException} RosterStatus에 없는 문자열을 전달할 경우 발생
   */
  async getTeamRosters(
    teamId: number,
    page?: number,
    limit?: number,
    option?: string
  ): Promise<RosterWithAthleteManyDTO[]> {
    return await this.getRosterService.getTeamRosters(
      teamId,
      page,
      limit,
      option
    )
  }

  /**
   * 계정에 연결된 로스터 목록을 반환합니다.
   *
   * @param {number} accountId - 로스터 목록을 조회할 계정의 Id
   * @returns {Promise<RosterWithAthleteDTO[]>} 계정에 연결된 로스터 목록
   */
  async getAccountRosters(accountId: number): Promise<RosterWithAthleteDTO[]> {
    return await this.getRosterService.getAccountRosters(accountId)
  }

  /**
   * 로스터 및 선수 정보를 생성하고 생성된 로스터 정보를 반환합니다
   *
   * @param {CreateRosterDTO} rosterDTO - 생성할 로스터 정보가 담긴 객체
   * @param {number} accountId - 로스터 생성을 요청하는 계정의 Id
   * @returns {Promise<T>} 생성된 로스터 정보
   * @throws {ParameterValidationException} 로스터 정보 객체에 유효하지 않은 값이 있을 경우 발생
   * @throws {EntityNotExistException} 존재하지 않는 팀의 Id를 전달할 경우 발생
   * @throws {ForbiddenAccessException} 매니저 계정으로 요청시 현재 계정과 일치하지 않는 팀의 로스터를 생성하려는 경우 발생
   */
  async createRoster(
    rosterDTO: CreateRosterDTO,
    accountId: number
  ): Promise<T> {
    return await this.createRosterService.createRoster(rosterDTO, accountId)
  }

  /**
   * 로스터를 삭제하고 삭제된 로스터 정보를 반환합니다.
   * @param {number} rosterId - 삭제할 로스터의 Id
   * @param {number} accountId - 삭제를 요청하는 계정의 Id
   * @returns {Promise<T>} 삭제된 로스터 정보
   * @throws {EntityNotExistException} 존재하지 않는 로스터의 Id를 전달할 경우 발생
   * @throws {ForbiddenAccessException} 매니저 계정으로 자신의 팀이 아닌 다른 팀 로스터에 해당 요청을 보낼 경우 발생
   */
  async deleteRoster(rosterId: number, accountId: number): Promise<T> {
    return await this.deleteRosterService.deleteRoster(rosterId, accountId)
  }

  /**
   * 로스터의 정보를 변경하고 변경된 로스터를 반환합니다.
   *
   * @param {number} rosterDTO - 변경할 로스터 정보가 담긴 객체
   * @param {number} rosterId - 변경할 로스터의 Id
   * @param {number} accountId - 변경을 요청하는 계정의 Id
   * @returns {Promise<T>} 변경된 로스터
   * @throws {EntityNotExistException} 존재하지 않는 로스터의 Id를 전달할 경우 발생
   * @throws {ForbiddenAccessException} 매니저 계정으로 요청시 다른 로스터에 해당 요청을 보낼 경우 발생
   * @throws {ParameterValidationException} 변경할 로스터 정보 객체에 유효하지 않은 값 또는 누락된 값이 있을 경우 발생
   */
  async updateRoster(
    rosterDTO: UpdateRosterDTO,
    rosterId: number,
    accountId: number
  ): Promise<T> {
    return await this.updateRosterService.updateRoster(
      rosterDTO,
      rosterId,
      accountId
    )
  }

  /**
   * 특정 계정의 연결 가능한 로스터 목록을 불러옵니다.
   *
   * @param {number} accountId - 연결 가능한 로스터 목록을 불러올 계정의 Id
   * @return {Promise<ConnectableRosterDTO[]>} 연결 가능한 로스터 목록
   * @throws {ForbiddenAccessException} 본인 인증을 하지 않은 계정으로 해당 요청을 보낼 경우 발생
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id를 전달할 경우 발생
   */
  async getConnectableRosters(
    accountId: number
  ): Promise<RosterWithAthleteDTO[]> {
    return await this.connectRosterService.getConnectableRosters(accountId)
  }

  /**
   * 특정 계정과 로스터를 연동하고 연동된 로스터를 반환합니다.
   *
   * @param {number} accountId - 로스터를 연결할 계정의 Id
   * @param {number} rosterId - 계정에 연결할 로스터의 Id
   * @returns {Promise<T>} 연결된 로스터 정보
   * @throws {ForbiddenAccessException} 로그인한 계정이 아닌 다른 계정 또는 본인 인증을 마치치 않은 계정으로 해당 요청을 보낼 경우 발생
   */
  async connectRoster(
    accountId: number,
    rosterId: number
  ): Promise<RosterWithAthleteDTO> {
    return await this.connectRosterService.connectRoster(accountId, rosterId)
  }

  /**
   * 팀에 로스터 생성을 요청하고 생성 여부를 반환합니다.
   *
   * @param {number} accountId - 로스터 생성을 요청하는 계정의 Id
   * @param {RequestRosterDTO} rosterDTO - 생성할 로스터 정보가 담긴 객체
   * @returns {Promise<string>} 요청 생성 여부
   * @throws {ForbiddenAccessException} 본인 인증을 하지 않은 계정으로 해당 요청을 보낼 경우 발생
   * @throws {EntityNotExistException} 존재하지 않는 계정 또는 팀의 Id를 전달할 경우 발생
   * @throws {ConflictFoundExcption} 이미 해당 팀에 존재하는 로스터나 중복된 요청을 보낼 경우 발생
   */
  async requestCreateRoster(
    accountId: number,
    rosterDTO: RequestRosterDTO
  ): Promise<string> {
    return await this.connectRosterService.requestCreateRoster(
      accountId,
      rosterDTO
    )
  }

  /**
   * 특정 팀의 로스터 생성 요청 목록을 반환합니다
   * @param {number} managerId - 목록을 조회할 팀 매니저 계정의 Id
   * @returns {Promise<RosterWithAthleteDTO[]>} 로스터 생성 요청 목록
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id를 보낼 경우 발생
   */
  async getCreateRosterRequests(
    managerId: number
  ): Promise<RosterWithAthleteDTO[]> {
    return await this.connectRosterService.getCreateRosterRequests(managerId)
  }

  /**
   * 로스터 생성 요청을 승인합니다
   *
   * @param {number} rosterId - 승인할 로스터의 Id
   * @param {number} managerId - 매니저 계정 Id
   * @returns {string} 성공할 경우 문자열 'success'를 반환합니다
   * @throws {EntityNotExistException} 존재하지 않는 계정 또는 로스터의 Id를 보낼 경우 발생
   * @throws {ForbiddenAccessException} 다른 팀의 로스터에 해당 요청을 보낼 경우 발생
   */
  async approveCreateRosterRequest(
    rosterId: number,
    managerId: number
  ): Promise<string> {
    return await this.connectRosterService.approveCreateRosterRequest(
      rosterId,
      managerId
    )
  }

  /**
   * 로스터 생성 요청을 반려하고 생성 요청을 삭제합니다
   *
   * @param {number} rosterId - 반려할 로스터의 Id
   * @param {number} managerId - 매니저 계정의 Id
   * @returns {string} 성공할 경우 문자열 'success'를 반환합니다
   * @throws {EntityNotExistException} 존재하지 않는 계정 또는 로스터의 Id를 보낼 경우 발생
   * @throws {ForbiddenAccessException} 다른 팀의 로스터에 해당 요청을 보낼 경우 발생
   */
  async rejectCreateRosterRequest(
    rosterId: number,
    managerId: number
  ): Promise<string> {
    return await this.connectRosterService.rejectCreateRosterRequest(
      rosterId,
      managerId
    )
  }
}
