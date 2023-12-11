import type { League, Sponser } from '@prisma/client'
import type { CreateLeagueDTO } from '../dto/create-league.dto'
import type { UpdateLeagueDTO } from '../dto/update-league.dto'
import type { CreateLeagueService } from '../interface/create-league.service.interface'
import type { DeleteLeagueService } from '../interface/delete-league.service.interface'
import type { GetLeagueService } from '../interface/get-league.service.interface'
import type { UpdateLeagueService } from '../interface/update-league.service.interface'

/**
 * 리그 관련 비즈니스 로직을 모아주는 추상 클래스.
 * 템플릿 메서드 패턴을 사용하며, [GetLeagueService], [CreateLeagueService], [DeleteLeagueService], [UpdateLeagueService] 구현체를 생성자에서 주입받아 사용합니다.
 * @template T - 'League' 타입을 확장하는 제네릭 타입
 * @template V - 'Sponser' 타입을 확장하는 제네릭 타입
 */
export abstract class LeagueService<T extends League, V extends Sponser> {
  constructor(
    private readonly createLeagueService: CreateLeagueService<T>,
    private readonly deleteLeagueService: DeleteLeagueService<T>,
    private readonly updateLeagueService: UpdateLeagueService<T>,
    private readonly getLeagueService: GetLeagueService<T, V>
  ) {}

  /**
   * 리그 정보를 반환합니다.
   *
   * @param {number} leagueId
   * @returns {T}
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  async getLeague(leagueId: number): Promise<T> {
    return await this.getLeagueService.getLeague(leagueId)
  }

  /**
   * 특정 협회의 리그 목록을 반환합니다.
   *
   * @param {number} associationId 리그 목록을 조회할 협회의 Id
   * @param {number} page 불러올 페이지
   * @param {number} [limit=10] 페이지당 불러올 리그의 수
   * @returns {T[]} 특정 협회의 리그 목록
   * @throws {EntityNotExistException} 존재하지 않는 협회의 Id를 전달할 경우 발생
   */
  async getLeaguesByAssociationId(
    associationId: number,
    page: number,
    limit?: number
  ): Promise<T[]> {
    return await this.getLeagueService.getLeaguesByAssociationId(
      associationId,
      page,
      limit
    )
  }

  /**
   * 특정 리그의 스폰서 목록을 반환합니다.
   *
   * @param {number} leagueId 스폰서 목록을 조회할 리그의 Id
   * @param {number} page 불러올 페이지
   * @param {number} [limit=10] 페이지당 불러올 리그의 수
   * @returns {V[]} 특정 리그의 스폰서 목록
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  async getSponsersByLeagueId(
    leagueId: number,
    page: number,
    limit?: number
  ): Promise<V[]> {
    return await this.getLeagueService.getSponsersByLeagueId(
      leagueId,
      page,
      limit
    )
  }

  /**
   * 리그 정보를 업데이트 하고 변경된 리그를 반환합니다.
   *
   * @param {number} leagueId - 정보를 변경할 리그의 Id
   * @param {Partial<T>} leagueDTO - 업데이트할 리그의 정보를 담은 객체
   * @returns {Promise<T>} 업데이트 리그 정보
   * @throws {EntityNotExistException} 존재하지 않는 리그 Id를 전달한 경우 발생
   * @throws {ParameterValidationException} 리그 시작 날짜와 종료 날짜를 잘못 전달한 경우 발생
   */
  async updateLeague(leagueId: number, leagueDTO: UpdateLeagueDTO): Promise<T> {
    return await this.updateLeagueService.updateLeague(leagueId, leagueDTO)
  }

  /**
   * 리그에 스폰서를 연결 합니다.
   *
   * @param {number} leagueId - 스폰서를 연결할 리그의 Id
   * @param {number} sponserId - 연결할 스폰서의 Id
   * @returns {void}
   * @throws {EntityNotExistException} 존재하지않는 스폰서 Id 또는 리그의 Id를 전달한 경우
   * @throws {ConflictFoundException} 이미 연결되어있는 스폰서의 Id를 전달한 경우
   */
  async linkSponser(leagueId: number, sponserId: number): Promise<void> {
    return await this.updateLeagueService.linkSponser(leagueId, sponserId)
  }

  /**
   * 리그에 연결된 스폰서를 연결 해제합니다.
   *
   * @param {number} leagueId - 스폰서를 연결할 리그의 Id
   * @param {number} sponserId - 연결할 스폰서의 Id
   * @returns {void}
   * @throws {EntityNotExistException} 존재하지않는 스폰서 Id 또는 리그의 Id를 전달한 경우
   */
  async unlinkSponser(leagueId: number, sponserId: number): Promise<void> {
    return await this.updateLeagueService.unlinkSponser(leagueId, sponserId)
  }

  /**
   * 리그를 생성 하고 생성된 리그를 반환합니다.
   *
   * @param {Partial<T>} leagueDTO - 생성할 협회의 정보가 담긴 객체
   * @returns {Promise<T>} 생성한 협회의 정보
   * @throws {EntityNotExistException} 존재하지 않는 협회의 Id를 전달한 경우 발생
   * @throws {ParameterValidationException} 유효하지 않은 시작 종료 날짜를 전달한 경우 발생
   */
  async createLeague(leagueDTO: CreateLeagueDTO): Promise<T> {
    return await this.createLeagueService.createLeague(leagueDTO)
  }

  /**
   * 특정 리그를 삭제하고 삭제된 리그 정보를 반환합니다.
   *
   * @param {number} leagueId - 삭제할 리그의 Id
   * @returns {T} 삭제된 리그 정보
   * @throws {EntityNotExistException} 존재하지 않는 리그의 Id를 전달할 경우 발생
   */
  async deleteLeague(leagueId: number): Promise<T> {
    return await this.deleteLeagueService.deleteLeague(leagueId)
  }
}
