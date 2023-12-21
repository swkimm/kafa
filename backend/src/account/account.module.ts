import { Module, forwardRef } from '@nestjs/common'
import { AuthModule } from '@/auth/auth.module'
import { AccountController } from './account.controller'
import { AccountServiceImpl } from './account.service'
import { AccountCertificationServiceImpl } from './service/account-certification.service'
import { AccountCredentialServiceImpl } from './service/account-credential.service'

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [AccountController],
  providers: [
    {
      provide: 'AccountService',
      useClass: AccountServiceImpl
    },
    {
      provide: 'AccountCertificationService',
      useClass: AccountCertificationServiceImpl
    },
    {
      provide: 'AccountCredentialService',
      useClass: AccountCredentialServiceImpl
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
