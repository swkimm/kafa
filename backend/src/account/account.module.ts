import { Module } from '@nestjs/common'
import { AuthModule } from '@/auth/auth.module'
import { AccountController } from './account.controller'
import { AccountServiceImpl } from './account.service'

@Module({
  imports: [AuthModule],
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
