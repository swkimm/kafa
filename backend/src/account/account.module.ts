import { Module } from '@nestjs/common'
import { AccountController } from './account.controller'
import { AccountServiceImpl } from './account.service'

@Module({
  controllers: [AccountController],
  providers: [
    {
      provide: 'AccountService',
      useClass: AccountServiceImpl
    }
  ],
  exports: [
    {
      provide: 'AccountService',
      useClass: AccountServiceImpl
    }
  ]
})
export class AccountModule {}
