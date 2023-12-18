import type { Score } from '@prisma/client'

/**
 * 경기의 점수 조회와 관련된 서비스 모음
 * @templage T - 'Score' 타입을 확장하는 제네릭 타입
 */
export interface GetScoreService<T extends Score> {
  /**
   * 경기의 점수를 반환합니다.
   *
   * @param {number} gameId -점수를 조회할 경기의 Id
   * @returns {T} 경기의 점수
   * @throws {EntityNotExistException} 존재하지 않는 경기의 Id를 전달할 경우 발생
   */
  getScore(gameId: number): Promise<T>
}
