import type { Game } from '@prisma/client'

/**
 * 경기 삭제와 관련된 서비스 모음
 * @templage T - 'Game' 타입을 확장하는 제네릭 타입
 */
export interface DeleteGameService<T extends Game> {
  /**
   * 경기를 삭제 하고 삭제된 경기를 반환합니다.
   *
   * @param {number} gameId - 삭제할 경기의 Id
   * @returns {Promise<T>} 경기정보
   * @throws {EntityNotExistException} 존재하지 않는 경기의 Id를 전달할 경우 발생
   */
  deleteGame(gameId: number): Promise<T>
}
