import axiosInstance from '@/commons/axios'
import { Role } from '@/commons/interfaces/account/profile'
import { userState } from '@/state/userState'
import { useRecoilState } from 'recoil'

const useAuth = () => {
  const [user, setUser] = useRecoilState(userState)

  // 브라우저 로컬 스토리지에 토큰이 있는 경우 재발급 시도
  const reloadCredential = async () => {
    try {
      setUser({ ...user, isRoleLoaded: false })
      const storedToken = localStorage.getItem('token')

      if (!storedToken) {
        resetUserState()
        return
      }

      const credentialResponse = await axiosInstance.get('/auth/reissue', {
        withCredentials: true
      })

      const newToken = credentialResponse.headers.authorization
      localStorage.setItem('token', newToken)

      const response = await axiosInstance.get('/account/role')

      setUser({
        isLoggedIn: true,
        token: newToken,
        isRoleLoaded: true,
        role: response.data.role
      })
    } catch (error) {
      resetUserState()
    }
  }

  // 로그인
  const login = async (credentials: { username: string; password: string }) => {
    try {
      const credentialResponse = await axiosInstance.post(
        '/auth/login',
        credentials,
        {
          withCredentials: true
        }
      )

      const token = credentialResponse.headers.authorization
      localStorage.setItem('token', token)

      const response = await axiosInstance.get('/account/role')

      setUser({
        isLoggedIn: true,
        token: token,
        isRoleLoaded: true,
        role: response.data.role
      })
    } catch (error) {
      resetUserState()
      throw error
    }
  }

  // 로그아웃
  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout', undefined, {
        withCredentials: true
      })
      resetUserState()
    } catch (error) {
      resetUserState()
      throw error
    }
  }

  const resetUserState = () => {
    setUser({
      isLoggedIn: false,
      role: Role.Public,
      isRoleLoaded: true,
      token: null
    })

    localStorage.removeItem('token')
  }

  return { login, logout, reloadCredential }
}

export default useAuth
