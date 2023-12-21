import type { Game } from '@prisma/client'

/**
 * 경기 조회와 관련된 서비스 모음
 * @template T - 'Game' 타입을 확장하는 제네릭 타입
 */
export interface GetGameService<T extends Game> {
  /**
   * 경기 정보를 반환합니다.
   *
   * @param {number} gameId - 조회할 경기의 Id
   * @returns {Promise<T>} 경기정보
   * @throws {EntityNotExistException} 존재하지 않는 경기의 Id를 전달할 경우 발생
   */
  getGame(gameId: number): Promise<T>

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
}
