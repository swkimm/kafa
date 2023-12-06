export interface DeleteAssociationService<T> {
  deleteAssociation(associationId: number): Promise<T>
}
