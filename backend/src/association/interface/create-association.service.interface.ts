export interface CreateAssociationService<T> {
  createAssociation(associationDTO: Partial<T>): Promise<T>
}
