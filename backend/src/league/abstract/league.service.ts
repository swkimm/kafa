import type {
  League,
  LeagueApplyStatus,
  Sponser,
  TeamLeague
} from '@prisma/client'
import type { CreateLeagueDTO } from '../dto/create-league.dto'
import type { LeagueWithAssociationDTO } from '../dto/league-with-association.dto'
import type {
  RegisterLeagueAvaliabilityDTO,
  TeamRosterWithSensitiveInfoDTO
} from '../dto/register-league-availability.dto'
import type { UpdateLeagueDTO } from '../dto/update-league.dto'
import type { CreateLeagueService } from '../interface/create-league.service.interface'
import type { DeleteLeagueService } from '../interface/delete-league.service.interface'
import type { GetLeagueService } from '../interface/get-league.service.interface'
import type { JoinLeagueService } from '../interface/join-league.service.interface'
import type { UpdateLeagueService } from '../interface/update-league.service.interface'

/**
 * 리그 관련 비즈니스 로직을 모아주는 추상 클래스.
 * 템플릿 메서드 패턴을 사용하며, [GetLeagueService], [CreateLeagueService], [DeleteLeagueService], [UpdateLeagueService], [JoinLeagueService] 구현체를 생성자에서 주입받아 사용합니다.
 * @template T - 'League' 타입을 확장하는 제네릭 타입
 * @template U - 'TeamLeague' 타입을 확장하는 제네릭 타입
 * @template V - 'Sponser' 타입을 확장하는 제네릭 타입
 */
export abstract class LeagueService<
  T extends League,
  U extends TeamLeague,
  V extends Sponser
> {
  constructor(
    private readonly createLeagueService: CreateLeagueService<T>,
    private readonly deleteLeagueService: DeleteLeagueService<T>,
    private readonly updateLeagueService: UpdateLeagueService<T>,
    private readonly getLeagueService: GetLeagueService<T, V>,
    private readonly joinLeagueService: JoinLeagueService<U>
  ) {}

  /**
   * 리그 정보를 반환합니다.
   *
   * @param {number} leagueId
   * @returns {T}
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  async getLeague(leagueId: number): Promise<T> {
    return await this.getLeagueService.getLeague(leagueId)
  }

  /**
   * 리그 목록을 반환합니다.
   *
   * @param {number} page 불러올 페이지
   * @param {number} [limit=10] 한 번에 불러올 리그 수
   * @returns {Promise<T[]>} 리그 목록
   */
  async getLeagues(page: number, limit?: number): Promise<T[]> {
    return await this.getLeagueService.getLeagues(page, limit)
  }

  /**
   * 특정 협회의 리그 목록을 반환합니다.
   *
   * @param {number} associationId 리그 목록을 조회할 협회의 Id
   * @param {number} page 불러올 페이지
   * @param {number} [limit=10] 페이지당 불러올 리그의 수
   * @returns {T[]} 특정 협회의 리그 목록
   * @throws {EntityNotExistException} 존재하지 않는 협회의 Id를 전달할 경우 발생
   */
  async getLeaguesByAssociationId(
    associationId: number,
    page: number,
    limit?: number
  ): Promise<T[]> {
    return await this.getLeagueService.getLeaguesByAssociationId(
      associationId,
      page,
      limit
    )
  }

  /**
   * 특정 리그의 스폰서 목록을 반환합니다.
   *
   * @param {number} leagueId 스폰서 목록을 조회할 리그의 Id
   * @param {number} page 불러올 페이지
   * @param {number} [limit=10] 페이지당 불러올 리그의 수
   * @returns {V[]} 특정 리그의 스폰서 목록
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  async getSponsersByLeagueId(
    leagueId: number,
    page: number,
    limit?: number
  ): Promise<V[]> {
    return await this.getLeagueService.getSponsersByLeagueId(
      leagueId,
      page,
      limit
    )
  }

  /**
   * 리그 정보를 업데이트 하고 변경된 리그를 반환합니다.
   *
   * @param {number} leagueId - 정보를 변경할 리그의 Id
   * @param {Partial<T>} leagueDTO - 업데이트할 리그의 정보를 담은 객체
   * @returns {Promise<T>} 업데이트 리그 정보
   * @throws {EntityNotExistException} 존재하지 않는 리그 Id를 전달한 경우 발생
   * @throws {ParameterValidationException} 리그 시작 날짜와 종료 날짜를 잘못 전달한 경우 발생
   */
  async updateLeague(leagueId: number, leagueDTO: UpdateLeagueDTO): Promise<T> {
    return await this.updateLeagueService.updateLeague(leagueId, leagueDTO)
  }

  /**
   * 리그에 스폰서를 연결 합니다.
   *
   * @param {number} leagueId - 스폰서를 연결할 리그의 Id
   * @param {number} sponserId - 연결할 스폰서의 Id
   * @returns {void}
   * @throws {EntityNotExistException} 존재하지않는 스폰서 Id 또는 리그의 Id를 전달한 경우
   * @throws {ConflictFoundException} 이미 연결되어있는 스폰서의 Id를 전달한 경우
   */
  async linkSponser(leagueId: number, sponserId: number): Promise<void> {
    return await this.updateLeagueService.linkSponser(leagueId, sponserId)
  }

  /**
   * 리그에 연결된 스폰서를 연결 해제합니다.
   *
   * @param {number} leagueId - 스폰서를 연결할 리그의 Id
   * @param {number} sponserId - 연결할 스폰서의 Id
   * @returns {void}
   * @throws {EntityNotExistException} 존재하지않는 스폰서 Id 또는 리그의 Id를 전달한 경우
   */
  async unlinkSponser(leagueId: number, sponserId: number): Promise<void> {
    return await this.updateLeagueService.unlinkSponser(leagueId, sponserId)
  }

  /**
   * 리그를 생성 하고 생성된 리그를 반환합니다.
   *
   * @param {Partial<T>} leagueDTO - 생성할 협회의 정보가 담긴 객체
   * @returns {Promise<T>} 생성한 협회의 정보
   * @throws {EntityNotExistException} 존재하지 않는 협회의 Id를 전달한 경우 발생
   * @throws {ParameterValidationException} 유효하지 않은 시작 종료 날짜를 전달한 경우 발생
   */
  async createLeague(leagueDTO: CreateLeagueDTO): Promise<T> {
    return await this.createLeagueService.createLeague(leagueDTO)
  }

  /**
   * 특정 리그를 삭제하고 삭제된 리그 정보를 반환합니다.
   *
   * @param {number} leagueId - 삭제할 리그의 Id
   * @returns {T} 삭제된 리그 정보
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  async deleteLeague(leagueId: number): Promise<T> {
    return await this.deleteLeagueService.deleteLeague(leagueId)
  }

  /**
   * 리그 참여를 요청하고 생성된 요청 정보를 반환합니다
   *
   * @param {number} leagueId - 참여 신청할 리그의 Id
   * @param {number} managerId - 참여 신청할 팀 계정의 Id
   * @returns {Promise<T>} 생성된 요청 정보
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   * @throws {UnprocessableDataException} 신청하는 팀에 유효하지 않은 로스터가 포함된 경우 발생
   * @throws {ConflictFoundException} 이미 신청을 완료한 리그에 다시 신청을 요청할 경우 발생
   */
  async requestJoinLeague(leagueId: number, managerId: number): Promise<U> {
    return await this.joinLeagueService.requestJoinLeague(leagueId, managerId)
  }

  /**
   * 선수 로스터에 관련 증명서 정보 입력 완료 여부를 반환합니다
   *
   * @param {number} managerId - 로스터 정보를 확인할 팀 매니저 계정의 Id
   * @returns {Promise<RegisterLeagueAvaliabilityDTO>} 팀의 로스터 유효성 여부를 담은 객체
   */
  async checkTeamRosterCertifications(
    managerId: number
  ): Promise<RegisterLeagueAvaliabilityDTO> {
    return await this.joinLeagueService.checkTeamRosterCertifications(managerId)
  }

  /**
   * 리그 참여를 승인하고 승인된 정보를 반환합니다
   *
   * @param {number} teamId - 참여를 승인할 팀의 Id
   * @param {number} leagueId - 참여를 승인할 리그의 Id
   * @returns {Promise<T>} 승인된 팀의 리그 참여 정보
   * @throws {EntityNotExistException} 존재하지 않는 팀 또는 리그의 Id를 전달하거나, 해당하는 신청 정보가 없을 때 발생
   * @throws {ConflictFoundException} 이미 처리가 완료된 참여 요청에 대해 해당 함수를 호출할 경우 발생
   */
  async approveRegisterLeague(teamId: number, leagueId: number): Promise<U> {
    return await this.joinLeagueService.approveRegisterLeague(teamId, leagueId)
  }

  /**
   * 리그 참여를 반려 또는 보류하고 반려된 정보를 반환합니다
   *
   * @param {number} teamId - 리그 참여를 반려할 팀의 Id
   * @param {number} leagueId - 반려할 리그의 Id
   * @param {string} reason - 반려 또는 보류 사유
   * @param {LeagueApplyStatus} [type='Hold'] 반려 또는 보류 여부
   * @returns {Promise<T>} 팀의 리그 참여 정보
   * @throws {EntityNotExistException} 존재하지 않는 팀 또는 리그의 Id를 전달하거나, 해당하는 신청 정보가 없을 때 발생
   * @throws {ConflictFoundException} 이미 처리가 완료된 참여 요청에 대해 해당 함수를 호출할 경우 발생
   */
  async rejectRegisterLeague(
    teamId: number,
    leagueId: number,
    reason: string,
    type?: LeagueApplyStatus
  ): Promise<U> {
    return await this.joinLeagueService.rejectRegisterLeague(
      teamId,
      leagueId,
      reason,
      type
    )
  }

  /**
   * 참여 신청이 가능한 리그 목록을 반환합니다
   *
   * @param {number} [limit=10] 불러올 리그의 수
   * @returns {Promise<LeagueWithAssociationDTO[]>} 시작 날짜가 늦은 순은로 정렬된 리그 목록
   */
  async getJoinableLeagues(
    limit?: number
  ): Promise<LeagueWithAssociationDTO[]> {
    return await this.joinLeagueService.getJoinableLeagues(limit)
  }

  /**
   * 특정 리그의 참여 신청 목록을 반환합니다
   *
   * @param {number} leagueId - 신청 목록을 확인할 리그의 Id
   * @returns {Promise<T[]>} 신청 목록
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  async getJoinLeagueRequests(leagueId: number): Promise<U[]> {
    return await this.joinLeagueService.getJoinLeagueRequests(leagueId)
  }

  /**
   * 팀에서 신청한 리그 참여 요청 목록을 반환합니다
   *
   * @param {number} managerId - 리그 참여 요청 목록을 조회할 팀 매니저 계정의 Id
   * @returns {Promise<T[]>} 리그 참여 요청 목록
   */
  async getTeamJoinLeagueRequests(managerId: number): Promise<U[]> {
    return await this.joinLeagueService.getTeamJoinLeagueRequests(managerId)
  }

  /**
   * 리그 참여를 신청한 팀의 로스터와 개인 증명서 목록을 반환합니다
   *
   * @param {number} teamId
   * @param {number} leagueId
   * @returns {TeamRosterWithSensitiveInfoDTO} 팀의 로스터와 개인 증명서 목록이 담긴 객체
   * @throws {EntityNotExistException} 존재하지 않는 팀 또는 리그의 Id를 전달하거나, 해당하는 신청 정보가 없을 때 발생
   */
  async getLeagueJoinRequestWithRosterAndCredentials(
    teamId: number,
    leagueId: number
  ): Promise<TeamRosterWithSensitiveInfoDTO> {
    return await this.joinLeagueService.getLeagueJoinRequestWithRosterAndCredentials(
      teamId,
      leagueId
    )
  }

  /**
   * 보류된 리그 참여 요청에 대해 재심사를 요청하고 재신청 상태를 반환합니다
   *
   * @param {number} leagueId - 재심사를 요청할 리그의 Id
   * @param {number} managerId - 재심사를 요청할 팀의 매니저 계정 Id
   * @returns {Promise<T>} 리그 참여 재신청 상태
   * @throws {EntityNotExistException} 존재하지 않는 팀 또는 리그의 Id를 전달하거나, 해당하는 신청 정보가 없을 때 발생
   * @throws {UnprocessableDataException} 신청하는 팀에 유효하지 않은 로스터가 포함된 경우 발생
   * @throws {ConflictFoundException} 보류되지 않은 참여 요청에 대해 해당 함수를 호출할 경우 발생
   */
  async retryJoinLeague(leagueId: number, managerId: number): Promise<U> {
    return await this.joinLeagueService.retryJoinLeague(leagueId, managerId)
  }
}
