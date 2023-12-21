import type { Score } from '@prisma/client'
import type { UpdateScoreDTO } from '../dto/update-score.dto'

/**
 * 경기의 점수 업데이트와 관련된 서비스 모음
 * @template T - 'Score' 타입을 확장하는 제네릭 타입
 */
export interface UpdateScoreService<T extends Score> {
  /**
   * 경기의 점수를 업데이트하고 변경된 점수를 반환합니다.
   * 전달한 점수 배열로 부터 총점을 계산하여 등록합니다.
   *
   * @param {number} gameId - 점수를 업데이트 할 경기의 Id
   * @param {UpdateScoreDTO} scoreDTO - 업데이트할 점수 정보가 담긴 객체
   * @returns {T} 업데이트 된 점수
   * @throws {EntityNotExistException} 존재하지 않는 경기의 Id를 전달할 경우 발생
   * @throws {ParameterValidationException} 잘못된 연장여부 또는 스코어 정보를 전달할 경우 발생
   */
  updateScore(gameId: number, scoreDTO: UpdateScoreDTO): Promise<T>
}
