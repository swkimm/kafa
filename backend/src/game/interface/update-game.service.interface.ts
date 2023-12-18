import type { Game } from '@prisma/client'
import type { UpdateGameDTO } from '../dto/update-game.dto'

/**
 * 경기 정보 변경과 관련된 서비스 모음
 * @templage T - 'Game' 타입을 확장하는 제네릭 타입
 */
export interface UpdateGameService<T extends Game> {
  /**
   * 경기를 정보를 변경하고 변경된 경기 정보를 반환합니다.
   *
   * @param {CreateGameDTO} gameDTO - 수정할 경기 정보를 담은 객체
   * @returns {Promise<T>} 변경된 경기 정보
   * @throws {EntityNotExistException} 존재하지 않는 경기나 리그, 팀의 id 값을 전달할 경우 발생
   * @throws {ParameterValidationException} 홈 팀과 어웨이 팀이 같을 경우 발생
   */
  updateGame(gameId: number, gameDTO: UpdateGameDTO): Promise<T>
}
