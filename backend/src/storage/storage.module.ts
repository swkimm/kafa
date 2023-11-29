import { Module } from '@nestjs/common'
import { ImageStorageServiceImpl } from './service/image-storage.service'
import { StorageController } from './storage.controller'

@Module({
  providers: [
    {
      provide: 'ImageStorageService',
      useClass: ImageStorageServiceImpl
    }
  ],
  controllers: [StorageController]
})
export class StorageModule {}
