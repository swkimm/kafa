import { Module } from '@nestjs/common'
import { AccountModule } from '@/account/account.module'
import { StorageModule } from '@/storage/storage.module'
import { BoardController } from './board.controller'
import { BoardService } from './board.service'

@Module({
  imports: [StorageModule, AccountModule],
  providers: [BoardService],
  controllers: [BoardController]
})
export class BoardModule {}
