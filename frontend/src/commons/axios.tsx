//workspace/frontend/src/commons/axios.tsx
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER_DOMAIN
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.authorization = token
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const response = await axiosInstance.get('/auth/reissue', {
          withCredentials: true
        })

        const newToken = response.headers.authorization

        localStorage.setItem('token', newToken)
        originalRequest.headers.authorization = newToken

        return axiosInstance(originalRequest)
      } catch (tokenError) {
        localStorage.removeItem('token')
        return Promise.reject(tokenError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
