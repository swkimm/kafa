import type { Association } from '@prisma/client'
import type { UpdateAssociationDTO } from '../dto/update-association.dto'

/**
 * 협회 정보를 변경하는 서비스 모음
 * @templage T - 'Association' 타입을 확장하는 제네릭 타입
 */
export interface UpdateAssociationService<T extends Association> {
  /**
   * 협회 정보를 변경하고 변경된 협회 정보를 반환합니다.
   *
   * @param {number} associationId - 변경할 협회의 Id
   * @param {Partial<T>} associationDTO - 변경할 정보가 담긴 객체
   * @returns {Promise<T>} 변경된 협회 정보
   * @throws {EntityNotExistException} 존재하지 않는 협회 Id를 변경할 협회 또는 상위 협회의 Id로 전달한 경우 발생
   * @throws {ParameterValidationException} 자신의 Id를 상위 협회 Id로 전달한 경우 발생
   */
  updateAssociation(
    associationId: number,
    associationDTO: UpdateAssociationDTO
  ): Promise<T>
}
