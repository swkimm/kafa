export const printStackTrace = (): string => {
  return new Error().stack
}
