import type { Account } from '@prisma/client'

export interface AccountService {
  updateLastLogin(username: string): Promise<void>

  getUserCredential(username: string): Promise<Account>
}
