import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  Inject
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AccountService } from '@/account/account.service.interface'
import { Role } from '@prisma/client'
import type { AuthenticatedRequest } from '../class/authenticated-request.interface'
import type { AuthenticatedUser } from '../class/authenticated-user.class'
import { PUBLIC } from '../decorator/guard.decorator'
import { ROLES_KEY } from '../decorator/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  #rolesHierarchy = {}

  constructor(
    private readonly reflector: Reflector,
    @Inject('AccountService') private readonly service: AccountService
  ) {
    Object.keys(Role).forEach((key, index) => {
      this.#rolesHierarchy[key] = index
    })
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest()

    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    const role =
      this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
        context.getHandler(),
        context.getClass()
      ]) ?? Role.User

    const user: AuthenticatedUser = request.user

    if (!user.role) {
      const userRole = (await this.service.getAccountRole(user.id)).role
      user.role = userRole
    }

    if (this.#rolesHierarchy[user.role] >= this.#rolesHierarchy[role]) {
      return true
    }

    return false
  }
}
