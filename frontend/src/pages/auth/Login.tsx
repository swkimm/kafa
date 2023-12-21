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

  const handleSignUp = () => {
    navigate('/signUp')
  }

  const handleLogin = async () => {
    const loginResult = await dispatch(loginUser({ username, password }))
    if (loginUser.fulfilled.match(loginResult)) {
      const roleResult = await dispatch(getRole())

      if (getRole.fulfilled.match(roleResult)) {
        console.log('Updated Role:', roleResult.payload) // 역할 정보 출력
        if (
          roleResult.payload === 'User' ||
          roleResult.payload === 'Manager' ||
          roleResult.payload === 'Admin'
        ) {
          navigate('/console')
        }
      }
    } else if (loginUser.rejected.match(loginResult)) {
      // 로그인 실패 처리
      console.log('로그인 실패:', loginResult.error.message)
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-40 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto w-2/3 sm:w-full"
          src="./logo/logo.png"
          alt="TBD"
        />
      </div>

      <div className="mx-auto mt-10 max-w-sm sm:w-full">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            아이디
          </label>
          <div className="mt-2">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
          <div className="mt-2">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={handleLogin}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            로그인
          </button>
          {status === 'loading' && <p>Loading...</p>}
          {error && <Notification title="로그인 오류" content={error} />}
        </div>

        <div className="mt-5 border border-gray-300" />

        <div className="mt-5">
          <button
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleSignUp}
          >
            회원 가입
          </button>
        </div>

        {/* <p className="mt-10 text-center text-xs text-gray-500">
          현재 팀 계정만 발급하고 있으며, 개인 계정 발급은 추후 오픈될
          예정입니다.
        </p> */}
      </div>
    </div>
  )
}

export default Login
