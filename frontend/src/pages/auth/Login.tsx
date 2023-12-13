import type { AppDispatch } from '@/app/store'
import type { RootState } from '@/app/store'
// import axiosInstance from '@/common/axios'
import Notification from '@/components/notifications/Notification'
import { getRole, loginUser } from '@/features/auth/authSlice'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()
  const { status, error } = useSelector((state: RootState) => state.auth)

  const handleLogin = async () => {
    const loginResult = await dispatch(loginUser({ username, password }))
    if (loginUser.fulfilled.match(loginResult)) {
      // const response = await axiosInstance.get('/account/role')
      // console.log(response)

      const roleResult = await dispatch(getRole())
      if (getRole.fulfilled.match(roleResult)) {
        console.log('Role:', roleResult.payload) // 역할 정보 출력
      }
      navigate('/')
    } else if (loginUser.rejected.match(loginResult)) {
      console.log('오류')
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-16 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto w-full" src="./logo/logo.png" alt="sdf" />
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            아이디
          </label>
          <div className="mt-1">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full rounded-lg border py-1.5 ps-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            패스워드
          </label>
          <div className="mt-1">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-lg border py-1.5 ps-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button onClick={handleLogin}>Login</button>
          {status === 'loading' && <p>Loading...</p>}
          {error && <Notification title="로그인 오류" content={error} />}
        </div>

        <p className="mt-10 text-center text-xs text-gray-500">
          현재 팀 계정만 발급하고 있으며, 개인 계정 발급은 추후 오픈될
          예정입니다.
        </p>
      </div>
    </div>
  )
}

export default Login
