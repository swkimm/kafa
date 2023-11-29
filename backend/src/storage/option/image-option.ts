import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import type { FileFilterCallback } from 'multer'
import { IMAGE_SIZE_LIMIT } from '../constant/image-size.constant'

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
    const ext = file.originalname.split('.').pop()
    if (!fileExts.includes(ext)) {
      return cb(null, false)
    }
    cb(null, true)
  }
}
