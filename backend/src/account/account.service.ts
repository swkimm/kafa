import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { AuthService } from '@/auth/auth.service.interface'
import { PinAuthService } from '@/auth/pin-auth.service.interface'
import { emailUpdateVerificationCacheKey } from '@/common/cache/cache-keys'
import { EMAIL_VERIFICATION_PIN_EXPIRE_TIME } from '@/common/constant/time.constants'
import {
  CacheException,
  ConflictFoundException,
  EntityNotExistException,
  UnexpectedException,
  UnidentifiedException,
  UnverifiedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { type Account, Role, AccountStatus, Prisma } from '@prisma/client'
import { hash } from 'argon2'
import { Cache } from 'cache-manager'
import { plainToClass } from 'class-transformer'
import type { AccountService } from './account.service.interface'
import { AccountDTO, AccountSerializer } from './dto/account.dto'
import type { RegisterAccountDTO } from './dto/registerAccount.dto'
import type { UpdateAccountProfileDTO } from './dto/updateAccount.dto'
import type { UpdateEmailDTO } from './dto/updateEmail.dto'
import type { UpdatePasswordDTO } from './dto/updatePassword.dto'

@Injectable()
export class AccountServiceImpl implements AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('EmailAuthService')
    private readonly emailAuthService: PinAuthService,
    @Inject('AuthService') private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}

  async getAccountRole(accountId: number): Promise<{
    role: Role
  }> {
    if (!(await this.isAccountExist('id', accountId))) {
      throw new EntityNotExistException('Invalid acconutId')
    }

    return await this.prismaService.account.findUnique({
      where: {
        id: accountId
      },
      select: {
        role: true
      }
    })
  }

  async updateLastPasswordChanged(accountId: number): Promise<void> {
    if (!(await this.isAccountExist('id', accountId))) {
      throw new EntityNotExistException('accountId')
    }

    await this.prismaService.account.update({
      where: { id: accountId },
      data: { lastPasswordChanged: new Date() }
    })
  }

  async registerAccount(
    accountDTO: RegisterAccountDTO,
    role: Role
  ): Promise<AccountDTO> {
    const isDuplicateEmail = await this.isEmailExist(accountDTO.email, role)
    if (isDuplicateEmail) {
      throw new ConflictFoundException('email already exists')
    }

    const isDuplicateUsername = await this.isAccountExist(
      'username',
      accountDTO.username
    )
    if (isDuplicateUsername) {
      throw new ConflictFoundException('username already exists')
    }

    const status =
      role === Role.User ? AccountStatus.Verifying : AccountStatus.Enable

    const account = await this.createAccount(accountDTO, role, status)

    if (role === Role.User) {
      await this.emailAuthService.registerPin(account.id, account.email)
    }

    return this.accountDTOSerializer(account)
  }

  async mappingManagerAccount(
    accountId: number,
    teamId: number
  ): Promise<AccountDTO> {
    try {
      const account = await this.prismaService.account.update({
        where: {
          id: accountId
        },
        data: {
          teamId
        }
      })

      return this.accountDTOSerializer(account)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new EntityNotExistException('accountId')
        }
        if (error.code === 'P2003') {
          throw new EntityNotExistException('teamId')
        }
      }
      throw new UnexpectedException(error)
    }
  }

  async verifyEmail(
    accountId: number,
    code?: string
  ): Promise<{ result: string }> {
    if (!(await this.isAccountExist('id', accountId))) {
      throw new EntityNotExistException('accountId')
    }

    const validPin = await this.emailAuthService.verifyPin(accountId, code)

    if (!validPin) {
      throw new UnidentifiedException('email pin code')
    }

    await this.prismaService.account.update({
      where: {
        id: accountId
      },
      data: {
        status: AccountStatus.Enable
      }
    })

    return this.emailAuthService.deletePin(accountId)
  }

  async verifyUpdateEmail(
    accountId: number,
    code?: string
  ): Promise<{ result: string }> {
    if (!(await this.isAccountExist('id', accountId))) {
      throw new EntityNotExistException('accountId')
    }

    try {
      const result = await this.emailAuthService.verifyPin(accountId, code)

      if (!result) {
        throw new UnidentifiedException('email pin code')
      }

      const email = await this.cache.get(
        emailUpdateVerificationCacheKey(accountId)
      )

      if (!email) {
        throw new CacheException('email pin empty')
      }

      await this.prismaService.account.update({
        where: {
          id: accountId
        },
        data: {
          email
        }
      })

      await this.cache.del(emailUpdateVerificationCacheKey(accountId))

      return this.emailAuthService.deletePin(accountId)
    } catch (error) {
      if (error instanceof UnidentifiedException) {
        throw error
      } else {
        throw new CacheException(error)
      }
    }
  }

  async getAccountProfile(accountId: number): Promise<AccountDTO> {
    if (!(await this.isAccountExist('id', accountId))) {
      throw new EntityNotExistException('accountId')
    }

    const account = await this.prismaService.account.findUnique({
      where: {
        id: accountId
      }
    })

    return this.accountDTOSerializer(account)
  }

  async updateAccountProfile(
    accountDTO: UpdateAccountProfileDTO,
    accountId: number
  ): Promise<AccountDTO> {
    if (!(await this.isAccountExist('id', accountId))) {
      throw new EntityNotExistException('accountId')
    }

    const account = await this.prismaService.account.update({
      where: {
        id: accountId
      },
      data: {
        ...accountDTO
      }
    })

    return this.accountDTOSerializer(account)
  }

  async updateEmail(
    accountDTO: UpdateEmailDTO,
    accountId: number
  ): Promise<{ result: string }> {
    if (!(await this.isAccountExist('id', accountId))) {
      throw new EntityNotExistException('accountId')
    }

    const { email } = accountDTO

    try {
      await this.cache.set(
        emailUpdateVerificationCacheKey(accountId),
        email,
        EMAIL_VERIFICATION_PIN_EXPIRE_TIME
      )

      return await this.emailAuthService.registerPin(accountId, email)
    } catch (error) {
      throw new CacheException(error)
    }
  }

  async withdrawAccount(accountId: number): Promise<AccountDTO> {
    if (!(await this.isAccountExist('id', accountId))) {
      throw new EntityNotExistException('accountId')
    }

    const account = await this.prismaService.account.update({
      where: {
        id: accountId
      },
      data: {
        deletedAt: new Date(),
        status: AccountStatus.Disable
      }
    })

    return this.accountDTOSerializer(account)
  }

  async requestUpdatePassword(accountId: number): Promise<{ result: string }> {
    if (!(await this.isAccountExist('id', accountId))) {
      throw new EntityNotExistException('accountId')
    }

    const { email } = await this.prismaService.account.findUnique({
      where: {
        id: accountId
      },
      select: {
        email: true
      }
    })

    await this.emailAuthService.registerPin(accountId, email)

    return { result: 'ok' }
  }

  async updatePassword(
    accountDTO: UpdatePasswordDTO,
    accountId: number
  ): Promise<{ result: string }> {
    if (!(await this.isAccountExist('id', accountId))) {
      throw new EntityNotExistException('accountId')
    }

    const account = await this.prismaService.account.findUnique({
      where: {
        id: accountId
      }
    })

    const validPassword = await this.authService.isValidUser(
      account,
      accountDTO.oldPassword
    )

    if (!validPassword) {
      throw new UnidentifiedException('password')
    }

    await this.prismaService.account.update({
      where: {
        id: accountId
      },
      data: {
        password: await hash(accountDTO.newPassword)
      }
    })

    return { result: 'ok' }
  }

  async isVerifiedAccount(accountId: number): Promise<void> {
    const account = await this.prismaService.account.findUnique({
      where: {
        id: accountId
      }
    })

    if (!account || account.status !== AccountStatus.Enable) {
      throw new UnverifiedException(accountId)
    }
  }

  async isAccountExist(
    key: 'id' | 'username',
    value: string | number
  ): Promise<boolean> {
    const account = await this.prismaService.account.findUnique({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      where: {
        [key]: value
      }
    })
    return account !== null
  }

  async isEmailExist(email: string, role: Role): Promise<boolean> {
    const account = await this.prismaService.account.findUnique({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        email_role: {
          email,
          role
        }
      }
    })

    return account !== null
  }

  /**
   * [미구현] 비밀번호 초기화
   */
  // async resetPassword(
  //   accountDTO: UpdatePasswordDTO,
  //   accountId: number
  // ): Promise<{ result: string }> {
  //   if (!(await this.isAccountExist('id', accountId))) {
  //     throw new EntityNotExistException('accountId')
  //   }

  //   const validPin = await this.emailAuthService.verifyPin(
  //     accountId,
  //     accountDTO.pin
  //   )

  //   if (validPin) {
  //     await this.prismaService.account.update({
  //       where: {
  //         id: accountId
  //       },
  //       data: {
  //         password: await this.hashPassword(accountDTO.password)
  //       }
  //     })

  //     return await this.emailAuthService.deletePin(accountId)
  //   }

  //   return { result: 'no' }
  // }

  /**
   * Account 엔티티를 받아 민감한 정보를 제거하고 반환합니다.
   * @param {Account} account - Account 엔티티
   * @returns {AccountDTO} 민감한 정보가 제거된 객체
   */
  private accountDTOSerializer(account: Account): AccountDTO {
    const result: AccountSerializer = plainToClass(AccountSerializer, account, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false
    })

    return new AccountDTO(result)
  }

  /**
   * 비밀번호 단방향 해싱함수
   * @param {string} password - 비밀번호
   * @returns {Promise<string>} 해싱된 비밀번호
   */
  private async hashPassword(password: string): Promise<string> {
    return await hash(password)
  }

  /**
   * 계정을 생성하고 생성된 계정을 반환합니다.
   * @param {RegisterAccountDTO} accountDTO - 생성할 계정 정보가 담긴 객체
   * @param {Role} role - 권한
   * @param status - 상태
   * @returns {Account} Account 엔티티
   */
  private async createAccount(
    accountDTO: RegisterAccountDTO,
    role: Role,
    status: AccountStatus
  ): Promise<Account> {
    const now = new Date()
    accountDTO.password = await this.hashPassword(accountDTO.password)

    return await this.prismaService.account.create({
      data: {
        role,
        createdAt: now,
        lastLogin: now,
        lastPasswordChanged: now,
        status,
        ...accountDTO
      }
    })
  }
}
