import useAuth from '@/hooks/useAuth'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const { showNotification } = useNotification()

  const handleLogin = async () => {
    try {
      setIsSubmitting(true)
      await login({
        username,
        password
      })
      navigate('/console')
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '로그인 실패',
        '아이디와 비밀번호를 확인해주세요',
        2500
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="mx-auto w-full max-w-[320px]">
        <div>
          <button onClick={() => navigate('/')}>
            <img className="mx-auto h-32" src="./logo/logo.png" alt="TBD" />
          </button>
        </div>
        <div className="mt-8 w-full">
          <div>
            <div className="isolate -space-y-px rounded-md shadow-sm">
              <div className="relative rounded-md rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-950">
                <label
                  htmlFor="username"
                  className="block text-xs font-medium text-gray-600"
                >
                  아이디
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="relative rounded-md rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-950">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-600"
                >
                  패스워드
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleLogin()
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button
              onClick={handleLogin}
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md bg-indigo-950 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-900"
            >
              로그인
            </button>
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm font-light text-gray-600">
              아직 계정이 없으시다면
            </span>
            <button
              className="ml-2 inline text-sm font-bold text-indigo-950 hover:text-indigo-900"
              onClick={() => navigate('/signup')}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
