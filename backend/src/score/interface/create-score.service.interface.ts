import type { Score } from '@prisma/client'
import type { CreateScoreDTO } from '../dto/create-score.dto'

/**
 * 경기의 점수 조회와 관련된 서비스 모음
 * @template T - 'Score' 타입을 확장하는 제네릭 타입
 */
export interface CreateScoreService<T extends Score> {
  /**
   * 경기의 점수를 생성하고 생성한 점수를 반환합니다.
   *
   * @param {number} gameId - 점수를 생성할 게임의 Id
   * @param {CreateScoreDTO} scoreDTO - 생성할 점수 정보가 담긴 객체
   * @returns {T} 생성한 점수
   * @throws {EntityNotExistException} 존재하지 않는 경기의 Id를 전달할 경우 발생
   * @throws {ConflictFoundException} 이미 스코어가 존재하는 경기에 새로 스코어를 생성 하려고 하는 경우 발생
   */
  createScore(gameId: number, scoreDTO: CreateScoreDTO): Promise<T>
}
