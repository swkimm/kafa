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

        const checkResponseStatus = async (
          url: string,
          retries = 5,
          interval = 250
        ): Promise<{ default: string }> => {
          try {
            const result = await axiosInstance.get(url)
            if (result.status === 200) {
              return { default: url }
            } else if (retries > 0) {
              await new Promise((resolve) => setTimeout(resolve, interval))
              return checkResponseStatus(url, retries - 1, interval)
            } else {
              throw new Error('이미지 로드 실패')
            }
          } catch (error) {
            if (retries > 0) {
              await new Promise((resolve) => setTimeout(resolve, interval))
              return checkResponseStatus(url, retries - 1, interval)
            }
            throw error
          }
        }

        return await checkResponseStatus(result.default)
      })
      .catch((error) => {
        throw error
      })
  }

  abort() {
    return null
  }
}
