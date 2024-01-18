export const optionalClassName = (
  base: string,
  condition: boolean,
  onConditionTrue: string,
  onConditionFalse: string
): string => {
  return base + ' ' + (condition ? onConditionTrue : onConditionFalse)
}
