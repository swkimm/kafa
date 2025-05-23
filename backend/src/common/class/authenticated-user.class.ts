import { Role } from '@prisma/client'

export class AuthenticatedUser {
  #id: number
  #username: string
  #role: Role

  constructor(id: number, username: string) {
    this.#id = id
    this.#username = username
  }

  get id() {
    return this.#id
  }

  get username() {
    return this.#username
  }

  get role() {
    return this.#role
  }

  set role(role) {
    this.#role = role
  }

  isAdmin(): boolean {
    return this.#role === Role.Admin
  }
}
