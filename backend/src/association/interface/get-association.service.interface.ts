export interface GetAssociationService<T> {
  getAssociation(associationId: number): Promise<T>
  getAssociations(page: number, limit?: number): Promise<T[]>
}
