import { Module } from '@nestjs/common'
import { AccountModule } from '@/account/account.module'
import { StorageModule } from '@/storage/storage.module'
import { AttachmentService } from './attachment.service'
import { BoardController } from './board.controller'
import { BoardService } from './board.service'
import { CommentService } from './comment.service'

@Module({
  imports: [StorageModule, AccountModule, StorageModule],
  providers: [BoardService, CommentService, AttachmentService],
  controllers: [BoardController]
})
export class BoardModule {}
