export abstract class AssociationService<T> {
  abstract getAssociation(associationId: number): Promise<T>
}
