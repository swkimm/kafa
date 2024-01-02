import type { LeagueApplyStatus, TeamLeague } from '@prisma/client'
import type { LeagueWithAssociationDTO } from '../dto/league-with-association.dto'
import type {
  RegisterLeagueAvaliabilityDTO,
  TeamRosterWithSensitiveInfoDTO
} from '../dto/register-league-availability.dto'

/**
 * 리그 참여 신청과 관련된 서비스 인터페이스
 *
 * @template T - 'TeamLeague' 타입을 확장하는 제네릭 타입
 */
export interface JoinLeagueService<T extends TeamLeague> {
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
  requestJoinLeague(leagueId: number, managerId: number): Promise<T>

  /**
   * 선수 로스터에 관련 증명서 정보 입력 완료 여부를 반환합니다
   *
   * @param {number} managerId - 로스터 정보를 확인할 팀 매니저 계정의 Id
   * @returns {Promise<RegisterLeagueAvaliabilityDTO>} 팀의 로스터 유효성 여부를 담은 객체
   */
  checkTeamRosterCertifications(
    managerId: number
  ): Promise<RegisterLeagueAvaliabilityDTO>

  /**
   * 리그 참여를 승인하고 승인된 정보를 반환합니다
   *
   * @param {number} teamId - 참여를 승인할 팀의 Id
   * @param {number} leagueId - 참여를 승인할 리그의 Id
   * @returns {Promise<T>} 승인된 팀의 리그 참여 정보
   * @throws {EntityNotExistException} 존재하지 않는 팀 또는 리그의 Id를 전달하거나, 해당하는 신청 정보가 없을 때 발생
   */
  approveRegisterLeague(teamId: number, leagueId: number): Promise<T>

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
  rejectRegisterLeague(
    teamId: number,
    leagueId: number,
    reason: string,
    type?: LeagueApplyStatus
  ): Promise<T>

  /**
   * 참여 신청이 가능한 리그 목록을 반환합니다
   *
   * @param {number} [limit=10] 불러올 리그의 수
   * @returns {Promise<LeagueWithAssociationDTO[]>} 시작 날짜가 늦은 순은로 정렬된 리그 목록
   */
  getJoinableLeagues(limit?: number): Promise<LeagueWithAssociationDTO[]>

  /**
   * 특정 리그의 참여 신청 목록을 반환합니다
   *
   * @param {number} leagueId - 신청 목록을 확인할 리그의 Id
   * @returns {Promise<T[]>} 신청 목록
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  getJoinLeagueRequests(leagueId: number): Promise<T[]>

  /**
   * 팀에서 신청한 리그 참여 요청 목록을 반환합니다
   *
   * @param {number} managerId - 리그 참여 요청 목록을 조회할 팀 매니저 계정의 Id
   * @returns {Promise<T[]>} 리그 참여 요청 목록
   */
  getTeamJoinLeagueRequests(managerId: number): Promise<T[]>

  /**
   * 리그 참여를 신청한 팀의 로스터와 개인 증명서 목록을 반환합니다
   *
   * @param {number} teamId
   * @param {number} leagueId
   * @returns {TeamRosterWithSensitiveInfoDTO} 팀의 로스터와 개인 증명서 목록이 담긴 객체
   * @throws {EntityNotExistException} 존재하지 않는 팀 또는 리그의 Id를 전달하거나, 해당하는 신청 정보가 없을 때 발생
   */
  getLeagueJoinRequestWithRosterAndCredentials(
    teamId: number,
    leagueId: number
  ): Promise<TeamRosterWithSensitiveInfoDTO>

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
  retryJoinLeague(leagueId: number, managerId: number): Promise<T>
}
