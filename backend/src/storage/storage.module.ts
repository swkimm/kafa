import { Global, Module } from '@nestjs/common'
import { FileStorageServiceImpl } from './service/\bfile-storage.service'
import { ImageStorageServiceImpl } from './service/image-storage.service'
import { StorageController } from './storage.controller'

@Global()
@Module({
  providers: [
    {
      provide: 'ImageStorageService',
      useClass: ImageStorageServiceImpl
    },
    {
      provide: 'FileStorageService',
      useClass: FileStorageServiceImpl
    }
  ],
  controllers: [StorageController],
  exports: [
    {
      provide: 'ImageStorageService',
      useClass: ImageStorageServiceImpl
    },
    {
      provide: 'FileStorageService',
      useClass: FileStorageServiceImpl
    }
  ]
})
export class StorageModule {}
