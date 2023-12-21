import type { League } from '@prisma/client'
import type { CreateLeagueDTO } from '../dto/create-league.dto'

/**
 * 리그 생성과 관련된 서비스 모음
 * @template T - 'League' 타입을 확장하는 제네릭 타입
 */
export interface CreateLeagueService<T extends League> {
  /**
   * 리그를 생성 하고 생성된 리그를 반환합니다.
   *
   * @param {Partial<T>} leagueDTO - 생성할 협회의 정보가 담긴 객체
   * @returns {Promise<T>} 생성한 협회의 정보
   * @throws {EntityNotExistException} 존재하지 않는 협회의 Id를 전달한 경우 발생
   * @throws {ParameterValidationException} 유효하지 않은 시작 종료 날짜를 전달한 경우 발생
   */
  createLeague(leagueDTO: CreateLeagueDTO): Promise<T>
}
