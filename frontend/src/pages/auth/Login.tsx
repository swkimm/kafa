import useAuth from '@/hooks/useAuth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()

  const handleLogin = async () => {
    try {
      setIsSubmitting(true)
      await login({
        username,
        password
      })
      navigate('/console')
    } catch (error) {
      alert('로그인 실패')
      location.reload()
    } finally {
      setIsSubmitting(false)
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
              disabled={isSubmitting}
              required
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="mt-2">
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
              disabled={isSubmitting}
              required
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={handleLogin}
            disabled={isSubmitting}
            className="flex w-full justify-center rounded-md bg-indigo-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-900"
          >
            로그인
          </button>
        </div>
        <div className="mt-1.5">
          <button
            className="flex w-full justify-center rounded-md bg-indigo-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-900"
            onClick={() => navigate('/signup')}
          >
            회원 가입
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
