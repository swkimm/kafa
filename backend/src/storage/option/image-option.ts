import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import type { FileFilterCallback } from 'multer'
import { IMAGE_SIZE_LIMIT } from '../constant/image-size.constant'

/**
 * NestJS 인터셉터에서 사용할 이미지 옵션들.
 * 이미지 크기와 타입을 검사합니다.
 */
export const IMAGE_OPTIONS: MulterOptions = {
  limits: {
    fieldSize: IMAGE_SIZE_LIMIT
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const fileExts = ['png', 'jpg', 'jpeg', 'webp', 'heif', 'heic']
    const ext = file.originalname.split('.').pop().toLocaleLowerCase()
    if (!fileExts.includes(ext)) {
      return cb(null, false)
    }
    cb(null, true)
  }
}
