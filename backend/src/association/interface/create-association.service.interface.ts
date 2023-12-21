import type { Association } from '@prisma/client'
import type { CreateAssociationDTO } from '../dto/create-association.dto'

/**
 * 협회 생성과 관련된 서비스 모음
 * @template T - 'Association' 타입을 확장하는 제네릭 타입
 */
export interface CreateAssociationService<T extends Association> {
  /**
   * 협회를 생성하고 생성한 협회 정보를 반봔합니다.
   *
   * @param {Partial<T>} associationDTO - 생성할 협회의 정보를 담은 객체
   * @returns {Promise<T>} 생성한 협회 정보
   * @throws {EntityNotExistException} 존재하지 않는 협회 Id를 상위 협회로 전달한 경우 발생
   */
  createAssociation(associationDTO: CreateAssociationDTO): Promise<T>
}
