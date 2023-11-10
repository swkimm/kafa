import { Controller, Inject } from '@nestjs/common'
import { AccountService } from './account.service.interface'

@Controller('account')
export class AccountController {
  constructor(
    @Inject('AccountService') private readonly accountService: AccountService
  ) {}
}
