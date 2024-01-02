import type {
  RosterWithAthleteDTO,
  RosterWithAthleteManyDTO
} from '../dto/roster-with-athlete.dto'

/**
 * 로스터 조회와 관련된 서비스 인터페이스
 */
export interface GetRosterService {
  /**
   * 로스터 정보를 반환합니다.
   *
   * @param {number} rosterId - 정보를 조회할 로스터의 Id
   * @returns {Promise<RosterWithAthleteDTO>} 로스터 정보
   * @throws {EntityNotExistException} 존재하지 않는 로스터의 Id를 전달할 경우 발생
   */
  getRoster(rosterId: number): Promise<RosterWithAthleteDTO>

  /**
   * 특정 팀의 특정 리그에서의 로스터 목록을 반환합니다.
   *
   * @param {number} teamId - 로스터를 조회할 팀의 아이디
   * @param {number} leagueId - 로스터를 조회할 리그의 아이디
   * @return {Promise<RosterWithAthleteManyDTO[]>} 로스터 목록
   * @throws {EntityNotExistException} 존재하지 않는 팀 또는 리그의 Id를 전달할 경우 발생
   */
  getTeamRostersByLeagueId(
    teamId: number,
    leagueId: number
  ): Promise<RosterWithAthleteManyDTO[]>

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
  getTeamRosters(
    teamId: number,
    page?: number,
    limit?: number,
    option?: string
  ): Promise<RosterWithAthleteManyDTO[]>
}
