import { Module } from '@nestjs/common'
import { LeagueSponserServiceImpl } from './league-sponser.service'

@Module({
  providers: [
    {
      provide: 'LeagueSponserService',
      useClass: LeagueSponserServiceImpl
    }
  ],
  exports: [
    {
      provide: 'LeagueSponserService',
      useClass: LeagueSponserServiceImpl
    }
  ]
})
export class LeagueSponserModule {}
