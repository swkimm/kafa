export interface GetAssociationService<T> {
  getAssociation(associationId: number): Promise<T>
}
