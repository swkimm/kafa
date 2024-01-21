import type { RegisterTeamRequest, Team } from '@prisma/client'
import type { TeamManyDTO } from '../dto/team-many.dto'

/**
 * 팀 조회와 관련된 서비스 인터페이스
 * @template T - 'Team'를 확장하는 제네릭 타입
 * @template U - 'RegisterTeamRequest'를 확장하는 제네릭 타입
 */
export interface GetTeamService<T extends Team, U extends RegisterTeamRequest> {
  /**
   * 팀을 반환합니다.
   *
   * @param {number} teamId - 조회할 팀 Id
   * @returns {Promise<T>} 팀
   * @throws {EntityNotExistException} 존재하지 않는 팀 Id를 전달할 경우 발생
   */
  getTeam(teamId: number): Promise<T>

  /**
   * 팀 목록을 반환합니다.
   * offset based pagination
   *
   * @param {number} page - 페이지 번호
   * @param {number} [limit=10] - 한 번에 불러올 팀 수
   * @param {string} [option] - 불러올 팀의 상태
   * @returns {Promise<T[]>} 팀 목록
   * @throws {ParameterValidationException} 잘못된 팀 상태를 전달한 경우 발생
   */
  getTeams(page: number, limit?: number, option?: string): Promise<T[]>

  /**
   * 이름 또는 영문이름을 포함하는 팀들을 반홥합니다
   *
   * @param {string} searchTerm - 팀 이름 (국문 또는 영문)
   * @param {number} [limit=5] - 최대로 불러올 검색 수 (최대 10)
   */
  getTeamsBySearch(searchTerm: string, limit?: number): Promise<TeamManyDTO[]>

  /**
   * 특정 협회에 속한 팀 목록을 반환합니다.
   *
   * @param {number} associationId - 소속 팀 목록을 조회할 협회의 Id
   * @returns {Promise<T[]>} 특정 협회에 속한 팀 목록
   * @throws {EntityNotExistException} 존재하지 않는 협회의 Id를 전달할 경우 발생
   */
  getAssociationTeams(associationId: number): Promise<T[]>

  /**
   * 특정 리그에 참여중인 팀 목록을 반환합니다.
   *
   * @param {number} leagueId - 참여중인 팀 목록을 조회할 리그의 Id
   * @returns {Promise<T[]>} 특정리그에 참여중인 팀 목록
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  getLeagueTeams(leagueId: number): Promise<T[]>

  /**
   * 특정 계정에서 요청한 팀 생성 요청 목록을 반환합니다.
   *
   * @param {number} accountId - 팀 생성 요청 목록을 조회할 계정의 Id
   * @returns {Promise<U[]>} 팀 생성 요청
   */
  getAccountRegisterTeamRequests(accountId: number): Promise<U[]>

  /**
   * 팀 생성 요청 목록을 반환합니다.
   * cursor based pagination
   *
   * @param {number} [limit=10] - 한 번에 불러올 요청 수
   * @param {number} [cursor] - 커서
   * @param {string} [option] - 불러올 팀의 상태
   * @returns {Promise<U[]>} 팀 생성 요청 목록
   * @throws {ParameterValidationException} 잘못된 팀 등록 상태를 전달할 경우 발생
   */
  getRegisterTeamRequests(
    limit?: number,
    cursor?: number,
    option?: string
  ): Promise<U[]>
}
