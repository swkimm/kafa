import { Global, Module } from '@nestjs/common'
import { EmailServiceImpl } from './email.service'

@Global()
@Module({
  providers: [{ provide: 'EmailService', useClass: EmailServiceImpl }],
  exports: [{ provide: 'EmailService', useClass: EmailServiceImpl }]
})
export class EmailModule {}
