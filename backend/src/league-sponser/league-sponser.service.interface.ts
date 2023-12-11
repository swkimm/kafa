import type { LeagueSponser } from '@prisma/client'
import type { CreateLeagueSponserDTO } from './dto/create-league-sponser.dto'
import type { UpdateLeagueSponserDTO } from './dto/update-league-sponser.dto'

/**
 * 리그와 스폰서를 중계하는 서브 모듈 인터페이스
 * @template T - 'LeagueSponser' 타입을 확장하는 제네릭 타입
 */
export interface LeagueSponserService<T extends LeagueSponser> {
  /**
   * 리그와 스폰서 연결을 반환합니다.
   *
   * @param {number} leagueId - 찾을 리그의 Id
   * @param {number} sponserId - 찾을 스폰서의 Id
   * @returns {T} 리그와 스폰서 연결
   * @throws {EntityNotExistException} 존재하지 않는 리그와 스폰서 연결의 Id를 전달한 경우
   */
  getLeagueSponser(leagueId: number, sponserId: number): Promise<T>

  /**
   * 특정 리그의 리그와 스폰서 연결 목록을 반환합니다.
   * offset based pagenation을 적용합니다.
   *
   * @param {number} sponserId - 리그와 스폰서 연결 목록을 조회할 리그의 Id
   * @param {number} page - 페이지 번호
   * @param {number} [limit=10] - 한번에 불러올 리그와 스폰서 연결 수
   * @returns {T[]} 리그와 스폰서 연결 목록
   */
  getLeagueSponsersBySponserId(
    sponserId: number,
    page: number,
    limit?: number
  ): Promise<T[]>

  /**
   * 특정 스폰서의 리그와 스폰서 연결 목록을 반환합니다.
   * offset based pagenation을 적용합니다.
   *
   * @param {number} leagueId - 리그와 스폰서 연결 목록을 조회할 스폰서의 Id
   * @param {number} page - 페이지 번호
   * @param {number} [limit=10] - 한번에 불러올 리그와 스폰서 연결 수
   * @returns {T[]} 리그와 스폰서 연결 목록
   */
  getLeagueSponsersByLeagueId(
    leagueId: number,
    page: number,
    limit?: number
  ): Promise<T[]>

  /**
   * 리그와 스폰서 연결을 생성하고 생성된 리그와 스폰서 연결을 반환합니다.
   *
   * @param {CreateLeagueSponserDTO} leagueSponserDTO - 리그와 스폰서 연결 생성 내용을 담은 객체
   * @throws {EntityNotExistException} 존재하지 않는 리그 또는 스폰서의 Id를 전달한 경우 발생
   * @returns {T} 생성된 리그와 스폰서 연결
   * @throws {ConflictFoundException} 이미 존재하는 리그와 스폰서 연결을 전달한 경우
   */
  createLeagueSponser(leagueSponserDTO: CreateLeagueSponserDTO): Promise<T>

  /**
   * 리그와 스폰서 연결 정보를 업데이트 하고 결과를 반환합니다.
   *
   * @param {number} leagueId - 리그와 스폰서 연결에서 리그의 Id
   * @param {number} sponserId - 리그와 스폰서 연결에서 스폰서의 Id
   * @param {number} leagueSponserDTO - 리그와 스폰서 연결 업데이트 내용을 담은 객체
   * @returns {T} 업데이트 된 리그와 스폰서
   * @throws {EntityNotExistException} 존재하지 않는 리그와 스폰서 연결의 Id를 전달한 경우
   * @throws {ConflictFoundException} 업데이트 내용으로 이미 존재하는 리그와 스폰서 연결을 전달한 경우
   * @
   */
  updateLeagueSponser(
    leagueId: number,
    sponserId: number,
    leagueSponserDTO: UpdateLeagueSponserDTO
  ): Promise<T>

  /**
   * 리그와 스폰서 연결을 삭제하고 삭제된 연결을 반환합니다.
   *
   * @param {number} leagueId - 삭제할 리그와 스폰서 연결에서 리그의 Id
   * @param {number} sponserId - 삭제할 리그와 스폰서 연결에서 스폰서의 Id
   * @returns {T} 삭제된 리그와 스폰서 연결
   * @throws {EntityNotExistException} 존재하지 않는 리그와 스폰서 연결의 Id를 전달한 경우
   */
  deleteLeagueSponser(leagueId: number, sponserId: number): Promise<T>
}
