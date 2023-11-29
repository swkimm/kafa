export const generatePassword = (): string => {
  let pin = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < 10; i++) {
    pin += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return pin
}
