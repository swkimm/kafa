import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'
import { Role } from '@prisma/client'
import { RolesGuard } from '../guard/roles.guard'
import { ROLES_KEY } from './roles.decorator'

export const PUBLIC = 'public'
export const Public = () => SetMetadata('public', true)

export const UseRolesGuard = (role: Role = Role.Admin) => {
  return applyDecorators(SetMetadata(ROLES_KEY, role), UseGuards(RolesGuard))
}
