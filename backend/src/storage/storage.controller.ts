import {
  BadRequestException,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Public } from '@/common/decorator/guard.decorator'
import { ImageStorageService } from './interface/image-storage.service.interface'
import { IMAGE_OPTIONS } from './option/image-option'

@Controller('storage')
export class StorageController {
  constructor(
    @Inject('ImageStorageService')
    private readonly imageStorageService: ImageStorageService
  ) {}

  @Public()
  @Post('test')
  @UseInterceptors(FileInterceptor('file', IMAGE_OPTIONS))
  async imageUploadTest(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Invalid file format or size')
    }

    try {
      return await this.imageStorageService.uploadObject(file, 'test/image')
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error)
    }
  }
}
