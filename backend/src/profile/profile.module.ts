import { Module } from '@nestjs/common'
import { AccountModule } from '@/account/account.module'
import { SponserModule } from '@/sponser/sponser.module'
import { StorageModule } from '@/storage/storage.module'
import { TeamModule } from '@/team/team.module'
import { ProfileController } from './profile.controller'
import { AccountProfileServiceImpl } from './service/account-profile.service'
import { SponserProfileServiceImpl } from './service/sponser-profile.service'
import { TeamProfileServiceImpl } from './service/team-profile.service'

@Module({
  imports: [AccountModule, TeamModule, SponserModule, StorageModule],
  controllers: [ProfileController],
  providers: [
    {
      provide: 'AccountProfileService',
      useClass: AccountProfileServiceImpl
    },
    {
      provide: 'TeamProfileService',
      useClass: TeamProfileServiceImpl
    },
    {
      provide: 'SponserProfileService',
      useClass: SponserProfileServiceImpl
    }
  ]
})
export class ProfileModule {}
