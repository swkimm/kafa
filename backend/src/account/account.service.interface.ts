import type { Role } from '@prisma/client'
import type { AccountDTO } from './dto/account.dto'
import type { RegisterAccountDTO } from './dto/registerAccount.dto'
import type { UpdateAccountProfileDTO } from './dto/updateAccount.dto'
import type { UpdateEmailDTO } from './dto/updateEmail.dto'
import type { UpdatePasswordDTO } from './dto/updatePassword.dto'

export interface AccountService {
  getAccountRole(accountId: number): Promise<{
    role: Role
  }>

  updateLastPasswordChanged(accountId: number): Promise<void>

  registerAccount(accountDTO: RegisterAccountDTO): Promise<AccountDTO>

  verifyEmail(
    identifier: string | number,
    code?: string
  ): Promise<{ result: string }>

  verifyUpdateEmail(
    identifier: string | number,
    code?: string
  ): Promise<{ result: string }>

  getAccountProfile(accountId: number): Promise<AccountDTO>

  updateEmail(
    accountDTO: UpdateEmailDTO,
    accountId: number
  ): Promise<{ result: string }>

  updateAccountProfile(
    accountDTO: UpdateAccountProfileDTO,
    accountId: number
  ): Promise<AccountDTO>

  requestUpdatePassword(accountId: number): Promise<{ result: string }>

  updatePassword(
    accountDTO: UpdatePasswordDTO,
    accountId: number
  ): Promise<{ result: string }>

  withdrawAccount(accountId: number): Promise<AccountDTO>
}
