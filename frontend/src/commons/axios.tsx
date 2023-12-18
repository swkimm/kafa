//workspace/frontend/src/commons/axios.tsx
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000'
})

// Axios 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Axios 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 토큰 만료 에러 처리 및 토큰 재발급 로직 추가 (필요한 경우)
    // 예시: if (error.response.status === 401) { ... }
    return Promise.reject(error)
  }
)

export default axiosInstance
