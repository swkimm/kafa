import type { CreateAssociationDTO } from '../dto/create-association.dto'
import type { UpdateAssociationDTO } from '../dto/update-association.dto'

export abstract class AssociationService<T> {
  abstract getAssociation(associationId: number): Promise<T>
  abstract getAssociations(page: number, limit?: number): Promise<T[]>
  abstract createAssociation(associationDTO: CreateAssociationDTO): Promise<T>
  abstract updateAssociation(
    associationId: number,
    associationDTO: UpdateAssociationDTO
  ): Promise<T>
  abstract deleteAssociation(associationId: number): Promise<T>
}
