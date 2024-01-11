import axiosInstance from '@/commons/axios'
import type { FileLoader, UploadAdapter } from '@ckeditor/ckeditor5-upload'

export class CustomUploadAdapter implements UploadAdapter {
  private loader: FileLoader

  constructor(loader: FileLoader) {
    this.loader = loader
  }

  async upload() {
    return this.loader.file
      .then(async (file: File | null) => {
        if (!file) {
          throw new Error('사진 업로드 실패')
        }

        const data = new FormData()
        data.append('image', file)

        const result = await axiosInstance
          .post('/boards/posts/images', data, {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                )
                console.log(`사진 업로드 진행률: ${percentCompleted}%`)
              }
            }
          })
          .then((result) => result.data)

        await new Promise((resolve) => setTimeout(resolve, 5000))

        return {
          default: result.default
        }
      })
      .catch((error) => {
        throw error
      })
  }

  abort() {
    return null
  }
}
