import type { Sponser } from '@prisma/client'
import type { UpdateSponserDTO } from '../dto/update-sponser.dto'

/**
 * 스폰서 정보 업데이트와 관련된 서비스 인터페이스
 * @templage T - Sponser 타입을 확장하는 제네릭 타입
 */
export interface UpdateSponserService<T extends Sponser> {
  /**
   * 스폰서 정보를 업데이트 하고 변경된 스폰서를 반환합니다.
   *
   * @param {number} sponserId - 업데이트 할 스폰서의 Id
   * @param {UpdateSponserDTO} sponserDTO - 스폰서 업데이트 정보가 담긴 객체
   * @returns {T} 변경된 스폰서
   * @throws {EntityNotExistException} 존재하지 않는 스폰서의 Id를 전달한 경우 발생
   */
  updateSponser(sponserId: number, sponserDTO: UpdateSponserDTO): Promise<T>
}
