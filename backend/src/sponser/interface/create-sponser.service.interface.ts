import type { Sponser } from '@prisma/client'
import type { CreateSponserDTO } from '../dto/create-sponser.dto'

/**
 * 스폰서 생성과 관련된 서비스 인터페이스
 * @template T - Sponser 타입을 확장하는 제네릭 타입
 */
export interface CreateSponserService<T extends Sponser> {
  /**
   * 스폰서를 생성하고 생성된 스폰서를 반환합니다.
   *
   * @param {CreateSponserDTO} sponserDTO - 생성할 스폰서의 정보가 담긴 객체
   * @returns {T} 생성된 스폰서
   */
  createSponser(sponserDTO: CreateSponserDTO): Promise<T>
}
