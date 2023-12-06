export interface UpdateAssociationService<T> {
  updateAssociation(
    associationId: number,
    associationDTO: Partial<T>
  ): Promise<T>
}
