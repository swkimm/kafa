import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Public } from '@/common/decorator/guard.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import { FileStorageService } from './interface/file-storage.service.interface'
import { ImageStorageService } from './interface/image-storage.service.interface'
import { FILE_OPTIONS } from './option/file-option'
import { IMAGE_OPTIONS } from './option/image-option'

@Controller('storage')
export class StorageController {
  constructor(
    @Inject('ImageStorageService')
    private readonly imageStorageService: ImageStorageService,
    @Inject('FileStorageService')
    private readonly fileStorageService: FileStorageService
  ) {}

  @Public()
  @Post('test/image')
  @UseInterceptors(FileInterceptor('image', IMAGE_OPTIONS))
  async imageUploadTest(@UploadedFile() image: Express.Multer.File) {
    if (!image) {
      throw new BadRequestException('Invalid image format or size')
    }

    try {
      return await this.imageStorageService.uploadObject(image, 'test/image')
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Post('test/file')
  @UseInterceptors(FileInterceptor('file', FILE_OPTIONS))
  async fileUploadTest(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Invalid file format or size')
    }

    try {
      return await this.fileStorageService.uploadObject(file, 'test/file')
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}
