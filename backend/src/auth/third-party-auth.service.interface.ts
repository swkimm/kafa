export interface ThirdPartyAuthService {
  verifyPin(identifier: number | string, code?: string): Promise<boolean>

  registerPin(
    identifier: number | string,
    target?: string
  ): Promise<{ result: string }>

  deletePin(identifier: number | string): Promise<{ result: string }>

  // private generatePin(): string
}
