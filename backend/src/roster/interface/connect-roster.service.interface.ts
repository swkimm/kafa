import type { RequestRosterDTO } from '../dto/create-roster.dto'
import type { RosterWithAthleteDTO } from '../dto/roster-with-athlete.dto'
import type { RosterWithCredentialDTO } from '../dto/roster-with-credential.dto'

export interface ConnectRosterService {
  /**
   * 특정 계정의 연결 가능한 로스터 목록을 불러옵니다.
   *
   * @param {number} accountId - 연결 가능한 로스터 목록을 불러올 계정의 Id
   * @return {Promise<ConnectableRosterDTO[]>} 연결 가능한 로스터 목록
   * @throws {ForbiddenAccessException} 본인 인증을 하지 않은 계정으로 해당 요청을 보낼 경우 발생
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id를 전달할 경우 발생
   */
  getConnectableRosters(accountId: number): Promise<RosterWithAthleteDTO[]>

  /**
   * 특정 계정과 로스터를 연동하고 연동된 로스터를 반환합니다.
   *
   * @param {number} accountId - 로스터를 연결할 계정의 Id
   * @param {number} rosterId - 계정에 연결할 로스터의 Id
   * @returns {Promise<T>} 연결된 로스터 정보
   * @throws {ForbiddenAccessException} 로그인한 계정이 아닌 다른 계정 또는 본인 인증을 마치치 않은 계정으로 해당 요청을 보낼 경우 발생
   */
  connectRoster(
    accountId: number,
    rosterId: number
  ): Promise<RosterWithAthleteDTO>

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
  requestCreateRoster(
    accountId: number,
    rosterDTO: RequestRosterDTO
  ): Promise<string>

  /**
   * 특정 팀의 로스터 생성 요청 목록을 반환합니다
   * @param {number} managerId - 목록을 조회할 팀 매니저 계정의 Id
   * @returns {Promise<RosterWithAthleteDTO[]>} 로스터 생성 요청 목록
   * @throws {EntityNotExistException} 존재하지 않는 계정의 Id를 보낼 경우 발생
   */
  getCreateRosterRequests(managerId: number): Promise<RosterWithAthleteDTO[]>

  /**
   * 팀 로스터중 계정에 연결되지 않은 로스터 목록을 반환합니다
   * Offset Based Pagination이 적용되어 있습니다
   *
   * @param {number} managerId - 팀 계정 식별자
   * @param {number} page - 조회할 페이지
   * @param {number} [limit=10] -
   * @return {Promise<RosterWithCredentialDTO[]>}
   */
  getUnconnectedRosters(
    managerId: number,
    page: number,
    limit?: number
  ): Promise<RosterWithCredentialDTO[]>

  /**
   * 로스터 생성 요청을 승인합니다
   *
   * @param {number} rosterId - 승인할 로스터의 Id
   * @param {number} managerId - 매니저 계정 Id
   * @returns {string} 성공할 경우 문자열 'success'를 반환합니다
   * @throws {EntityNotExistException} 존재하지 않는 계정 또는 로스터의 Id를 보낼 경우 발생
   * @throws {ForbiddenAccessException} 다른 팀의 로스터에 해당 요청을 보낼 경우 발생
   */
  approveCreateRosterRequest(
    rosterId: number,
    managerId: number
  ): Promise<string>

  /**
   * 로스터 생성 요청을 반려하고 생성 요청을 삭제합니다
   *
   * @param {number} rosterId - 반려할 로스터의 Id
   * @param {number} managerId - 매니저 계정의 Id
   * @returns {string} 성공할 경우 문자열 'success'를 반환합니다
   * @throws {EntityNotExistException} 존재하지 않는 계정 또는 로스터의 Id를 보낼 경우 발생
   * @throws {ForbiddenAccessException} 다른 팀의 로스터에 해당 요청을 보낼 경우 발생
   */
  rejectCreateRosterRequest(
    rosterId: number,
    managerId: number
  ): Promise<string>
}
