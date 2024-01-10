import axiosInstance from '@/commons/axios'

export const removeImage = (url: string) => {
  axiosInstance.delete('/boards/posts/images', {
    data: {
      url
    }
  })
}
