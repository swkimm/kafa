import type { Sponser } from '@prisma/client'
import type { CreateSponserDTO } from '../dto/create-sponser.dto'
import type { UpdateSponserDTO } from '../dto/update-sponser.dto'
import type { CreateSponserService } from '../interface/create-sponser.service.interface'
import type { DeleteSponserService } from '../interface/delete-sponser.service.interface'
import type { GetSponserService } from '../interface/get-sponser.service.interface'
import type { UpdateSponserService } from '../interface/update-sponser.service.interface'

/**
 * 스폰서 관련 비즈니스 로직을 모아주는 추상 클래스.
 * 템플릿 메서드 패턴을 사용하며, [GetSponserService], [CreateSponserService], [DeleteSponserService], [UpdateSponserService] 구현체를 생성자에서 주입받아 사용합니다.
 * @template T - 'Sponser' 타입을 확장하는 제네릭 타입
 */
export abstract class SponserService<T extends Sponser> {
  constructor(
    private readonly getSponserService: GetSponserService<T>,
    private readonly deleteSponserService: DeleteSponserService<T>,
    private readonly createSponserService: CreateSponserService<T>,
    private readonly updateSponserService: UpdateSponserService<T>
  ) {}

  /**
   * 스폰서를 반환합니다.
   *
   * @param {number} sponserId - 조회할 스폰서 Id
   * @returns {T} 스폰서
   * @throws {EntityNotExistException} 존재하지 않는 스폰서의 Id를 전달한 경우 발생
   */
  async getSponser(sponserId: number): Promise<T> {
    return await this.getSponserService.getSponser(sponserId)
  }

  /**
   * 스폰서 목록을 반환합니다.
   * offset based pagination
   *
   * @param {number} page - 페이지 번호
   * @param {number} limit - 한 번에 불러올 스폰서 수
   * @returns {T[]} 스폰서 목록
   */
  async getSponsers(page: number, limit?: number): Promise<T[]> {
    return await this.getSponserService.getSponsers(page, limit)
  }

  /**
   * 스폰서를 생성하고 생성된 스폰서를 반환합니다.
   *
   * @param {CreateSponserDTO} sponserDTO - 생성할 스폰서의 정보가 담긴 객체
   * @returns {T} 생성된 스폰서
   */
  async createSponser(sponserDTO: CreateSponserDTO): Promise<T> {
    return await this.createSponserService.createSponser(sponserDTO)
  }

  /**
   * 스폰서 정보를 업데이트 하고 변경된 스폰서를 반환합니다.
   *
   * @param {number} sponserId - 업데이트 할 스폰서의 Id
   * @param {UpdateSponserDTO} sponserDTO - 스폰서 업데이트 정보가 담긴 객체
   * @returns {T} 변경된 스폰서
   * @throws {EntityNotExistException} 존재하지 않는 스폰서의 Id를 전달한 경우 발생
   */
  async updateSponser(
    sponserId: number,
    sponserDTO: UpdateSponserDTO
  ): Promise<T> {
    return await this.updateSponserService.updateSponser(sponserId, sponserDTO)
  }

  /**
   * 스폰서를 삭제하고 삭제된 스폰서를 반환합니다.
   *
   * @param {number} sponserId - 삭제할 스폰서 Id
   * @returns {T} 삭제된 스폰서
   * @throws {EntityNotExistException} 존재하지 않는 스폰서의 Id를 전달한 경우 발생
   */
  async deleteSponser(sponserId: number): Promise<T> {
    return await this.deleteSponserService.deleteSponser(sponserId)
  }
}
