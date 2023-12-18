import type { Game } from '@prisma/client'
import type { CreateGameDTO } from '../dto/create-game.dto'

/**
 * 경기 생성과 관련된 서비스 모음
 * @templage T - 'Game' 타입을 확장하는 제네릭 타입
 */
export interface CreateGameService<T extends Game> {
  /**
   * 경기를 생성하고 생성한 경기를 반환합니다.
   *
   * @param {CreateGameDTO} gameDTO - 경기 생성 정보를 담은 객체
   * @returns {Promise<T>} 생성된 경기
   * @throws {EntityNotExistException} 존재하지 않는 리그나 팀의 id 값을 전달할 경우 발생
   * @throws {ParameterValidationException} 홈 팀과 어웨이 팀이 같을 경우 발생
   */
  createGame(gameDTO: CreateGameDTO): Promise<T>
}
