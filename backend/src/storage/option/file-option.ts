import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import type { FileFilterCallback } from 'multer'
import { FILE_SIZE_LIMIT } from '../constant/file-size.constants'

/**
 * NestJS 인터셉터에서 사용할 이미지 옵션들.
 * 이미지 크기와 타입을 검사합니다.
 */
export const FILE_OPTIONS: MulterOptions = {
  limits: {
    fieldSize: FILE_SIZE_LIMIT
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const fileExts = [
      'docs',
      'doc',
      'xlsx',
      'xls',
      'pdf',
      'ppt',
      'pptx',
      'zip',
      'hwp',
      'txt'
    ]
    const ext = file.originalname.split('.').pop().toLocaleLowerCase()
    if (!fileExts.includes(ext)) {
      return cb(null, false)
    }
    cb(null, true)
  }
}
