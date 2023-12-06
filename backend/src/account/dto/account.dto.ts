import { type Account, Role } from '@prisma/client'
import { Exclude, Expose } from 'class-transformer'

export class AccountDTO {
  id: number
  name: string
  email: string
  profileImgUrl: string
  role: Role

  constructor(account: AccountSerializer) {
    this.id = account.id
    this.name = account.name
    this.email = account.email
    this.profileImgUrl = account.profileImgUrl
    this.role = account.role
  }
}

export class AccountSerializer {
  @Exclude()
  password: string

  @Exclude()
  deletedAt: Date

  @Exclude()
  lastPasswordChanged: Date

  @Expose()
  id: number

  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  profileImgUrl: string

  @Expose()
  role: Role

  constructor(partial: Partial<Account>) {
    Object.assign(this, partial)
  }
}
