import type { Game } from '@prisma/client'
import type { GameManyDTO } from '../dto/game-many.dto'
import type { GameWithLeagueAndAssociationDTO } from '../dto/game-with-league-association.dto'
import type { GameWithLeagueDTO } from '../dto/game-with-league.dto'

/**
 * 경기 조회와 관련된 서비스 모음
 * @template T - 'Game' 타입을 확장하는 제네릭 타입
 */
export interface GetGameService<T extends Game> {
  /**
   * 경기 정보를 반환합니다.
   *
   * @param {number} gameId - 조회할 경기의 Id
   * @returns {Promise<GameWithLeagueAndAssociationDTO>} 경기정보
   * @throws {EntityNotExistException} 존재하지 않는 경기의 Id를 전달할 경우 발생
   */
  getGame(gameId: number): Promise<GameWithLeagueAndAssociationDTO>

  /**
   * 경기 목록을 조회합니다.
   * Cursor based pagination 을 사용합니다.
   *
   * @param {number} [cursor] - 현재 페이지의 커서
   * @param {number} [limit=10] - 한 번에 불러올 경기 수
   * @returns {Promise<T[]>} 경기 목록
   */
  getGames(cursor?: number, limit?: number): Promise<T[]>

  /**
   * 특정 리그의 경기 목록을 조회합니다.
   * Cursor based pagination 을 사용합니다.
   *
   * @param {number} leagueId - 경기 목록을 불러올 리그의 Id
   * @param {number} [cursor] - 현재 페이지의 커서
   * @param {number} [limit=10] - 한 번에 불러올 경기 수
   * @returns {Promise<T[]>} 경기 목록
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  getGamesByLeagueId(
    leagueId: number,
    cursor?: number,
    limit?: number
  ): Promise<T[]>

  /**
   * 특정 팀의 특정 리그에서의 경기 목록을 반환합니다
   *
   * @param {number} leagueId - 경기 목록을 불러올 리그의 Id
   * @param {number} teamId - 경기 목록을 불러올 팀의 Id
   * @returns {Promise<GameManyDTO[]>} 경기 목록
   */
  getGamesByLeagueIdAndTeamId(
    leagueId: number,
    teamId: number
  ): Promise<GameManyDTO[]>

  /**
   * 특정 리그의 날짜 범위에 해당하는 경기 목록을 반환합니다
   *
   * @param {number} leagueId - 리그 Id
   * @param {Date} startDate - 시작날짜
   * @param {Date} endDate - 종료날짜
   * @returns {Promise<GameWithLeagueAndAssociationDTO[]>}
   * @throws {BadRequestException} 시작날짜와 종료날짜가 역순인 경우 발생
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  getGamesByLeagueIdAndDate(
    leagueId: number,
    startDate: Date,
    endDate: Date
  ): Promise<GameWithLeagueAndAssociationDTO[]>

  /**
   * 최근 종료된 경기목록을 반환합니다
   *
   * @returns {Promise<GameWithLeagueDTO[]>} 최근 종료된 경기 목록
   */
  getCurrentlyEndedGames(): Promise<GameWithLeagueDTO[]>

  /**
   * 다가오는 경기목록을 반환합니다
   *
   * @returns {Promise<GameWithLeagueDTO[]>} 다가오는 경기 목록
   */
  getUpcommingGames(): Promise<GameWithLeagueDTO[]>

  /**
   * 특정 팀의 경기 목록을 반환합니다
   *
   * @param {number} teamId - 경기 목록을 조회할 팀의 Id
   * @param {number} page - 불러올 페이지 번호
   * @param {number} [limit=5] - 한 번에 불러올 경기 수
   * @returns {Promise<GameWithLeagueDTO[]>} 팀의 경기 목록
   * @throws {EntityNotExistException} 존재하지 않는 팀의 Id를 전달할 경우 발생
   */
  getGamesByTeamId(
    teamId: number,
    page: number,
    limit?: number
  ): Promise<GameWithLeagueDTO[]>
}
