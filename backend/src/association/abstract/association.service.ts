import type { Association } from '@prisma/client'
import type { CreateAssociationDTO } from '../dto/create-association.dto'
import type { UpdateAssociationDTO } from '../dto/update-association.dto'
import type { CreateAssociationService } from '../interface/create-association.service.interface'
import type { DeleteAssociationService } from '../interface/delete-association.service.interface'
import type { GetAssociationService } from '../interface/get-association.service.interface'
import type { UpdateAssociationService } from '../interface/update-association.service.interface'

/**
 * 협회 관련 비즈니스 로직을 모아주는 추상 클래스.
 * 템플릿 메서드 패턴을 사용하며, [GetAssociationService], [CreateAssociationService], [DeleteAssociationService], [UpdateAssociationService] 구현체를 생성자에서 주입받아 사용합니다.
 * @template T - 'Association' 타입을 확장하는 제네릭 타입
 */
export abstract class AssociationService<T extends Association> {
  constructor(
    private readonly getAssociationService: GetAssociationService<T>,
    private readonly createAssociationService: CreateAssociationService<T>,
    private readonly deleteAssociationService: DeleteAssociationService<T>,
    private readonly updateAssociationService: UpdateAssociationService<T>
  ) {}

  /**
   * 특정 협회 정보를 반환합니다.
   *
   * @param {number} associationId - 조회할 협회의 Id
   * @returns {Promise<T>} 조회한 협회 정보
   * @throws {EntityNotExistException} 존재하지 않는 협회의 Id 값을 전달한경우 발생
   */
  async getAssociation(associationId: number): Promise<T> {
    return await this.getAssociationService.getAssociation(associationId)
  }

  /**
   * 협회 목록을 불러옵니다.
   * offset based pagination을 적용해야 합니다.
   *
   * @param {number} page - 조회할 페이지
   * @param {number} [limit=10] - 한 번에 불러올 협회의 수
   * @returns {Promise<T[]>} 협회 목록
   */
  async getAssociations(page: number, limit?: number): Promise<T[]> {
    return await this.getAssociationService.getAssociations(page, limit)
  }

  /**
   * 협회를 생성하고 생성한 협회 정보를 반봔합니다.
   *
   * @param {Partial<T>} associationDTO - 생성할 협회의 정보를 담은 객체
   * @returns {Promise<T>} 생성한 협회 정보
   * @throws {EntityNotExistException} 존재하지 않는 협회 Id를 상위 협회로 전달한 경우 발생
   */
  async createAssociation(associationDTO: CreateAssociationDTO): Promise<T> {
    return await this.createAssociationService.createAssociation(associationDTO)
  }

  /**
   * 협회 정보를 변경하고 변경된 협회 정보를 반환합니다.
   *
   * @param {number} associationId - 변경할 협회의 Id
   * @param {Partial<T>} associationDTO - 변경할 정보가 담긴 객체
   * @returns {Promise<T>} 변경된 협회 정보
   * @throws {EntityNotExistException} 존재하지 않는 협회 Id를 변경할 협회 또는 상위 협회의 Id로 전달한 경우 발생
   * @throws {ParameterValidationException} 자신의 Id를 상위 협회 Id로 전달한 경우 발생
   */
  async updateAssociation(
    associationId: number,
    associationDTO: UpdateAssociationDTO
  ): Promise<T> {
    return await this.updateAssociationService.updateAssociation(
      associationId,
      associationDTO
    )
  }

  /**
   * 협회를 삭제하고 삭제된 협회의 정보를 반환합니다.
   *
   * @param {number} associationId - 삭제할 협회의 Id
   * @returns {Promise<T>} 삭제한 협회 정보
   * @throws {EntityNotExistException} 존재하지 않는 협회 Id를 전달할 경우 발생
   */
  async deleteAssociation(associationId: number): Promise<T> {
    return await this.deleteAssociationService.deleteAssociation(associationId)
  }
}
