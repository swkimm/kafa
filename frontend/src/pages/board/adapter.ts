import axiosInstance from '@/commons/axios'
import type { Editor } from '@ckeditor/ckeditor5-core'
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
          throw new Error('이미지 업로드 실패')
        }

        const data = new FormData()
        data.append('image', file)

        const result = await axiosInstance
          .post('/boards/posts/images', data)
          .then((result) => result.data)

        const checkResponseStatus = async (
          url: string,
          retries = 10,
          interval = 300
        ): Promise<{ default: string }> => {
          try {
            const result = await axiosInstance.get(
              `/boards/posts/image/upload-status?url=${url}`
            )
            if (result.data === true) {
              return { default: url }
            } else if (retries > 0) {
              await new Promise((resolve) => setTimeout(resolve, interval))
              return checkResponseStatus(url, retries - 1, interval)
            } else {
              throw new Error('이미지 업로드 실패')
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

// eslint-disable-next-line func-style
export function CustomUploadAdapterPlugin(editor: Editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (
    loader: FileLoader
  ) => {
    return new CustomUploadAdapter(loader)
  }
}
