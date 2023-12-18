import axiosInstance from '@/commons/axios'
import Alert from '@/components/notifications/Alert'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: ''
  })
  const [errorMessages, setErrorMessages] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    email: ''
  })
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [notification, setNotification] = useState({ title: '', content: '' })
  const [notificationKey, setNotificationKey] = useState(0) // 키 상태 추가
  const [showNotification, setShowNotification] = useState(false)

  // 아이디 유효성 검사
  const validateUsername = (username: string) => {
    const regex = /^[A-za-z0-9]+$/
    return regex.test(username)
  }

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    return regex.test(password)
  }

  // 이메일 유효성 검사
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    return regex.test(email)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
    // 입력값 변경에 따른 상태 업데이트
    if (name === 'username') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }))
      // 아이디 유효성 검사 및 에러 메시지 업데이트
      setErrorMessages((prev) => ({
        ...prev,
        username: validateUsername(value)
          ? ''
          : '아이디는 숫자와 영문자만 포함해야 합니다.'
      }))
    } else if (name === 'passwordConfirm') {
      setPasswordConfirm(value)
      setErrorMessages((prev) => ({
        ...prev,
        passwordConfirm:
          value === formData.password ? '' : '패스워드가 일치하지 않습니다.'
      }))
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }))

      // 유효성 검사 메시지 업데이트
      switch (name) {
        case 'username':
          setErrorMessages((prev) => ({
            ...prev,
            username: validateUsername(value)
              ? ''
              : '아이디는 숫자와 영문자만 포함해야 합니다.'
          }))
          break
        case 'email':
          setErrorMessages((prev) => ({
            ...prev,
            email: validateEmail(value)
              ? ''
              : '유효하지 않은 이메일 형식입니다.'
          }))
          break
        case 'password':
          setErrorMessages((prev) => ({
            ...prev,
            password: validatePassword(value)
              ? ''
              : '비밀번호는 8자 이상이며 숫자, 특수문자, 영문자를 포함해야 합니다.'
          }))
          break
        case 'passwordConfirm':
          setErrorMessages((prev) => ({
            ...prev,
            passwordConfirm:
              value === formData.password ? '' : '패스워드가 일치하지 않습니다.'
          }))
          break
      }
    }
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    // 각 필드가 비어 있는지 검사
    if (
      !formData.name ||
      !formData.username ||
      !formData.password ||
      !formData.email ||
      !passwordConfirm
    ) {
      setNotification({
        title: '오류',
        content: '모든 필드를 채워주세요.'
      })
      setShowNotification(true) // Notification 표시
      setNotificationKey((prevKey) => prevKey + 1) // 키 값을 변경하여 리렌더링 유발
      return
    }

    // 폼 전체 유효성 검사
    if (!validateForm()) {
      setNotification({
        title: '오류',
        content: '입력 정보를 확인해주세요.'
      })
      setShowNotification(true) // Notification 표시
      setNotificationKey((prevKey) => prevKey + 1) // 키 값을 변경하여 리렌더링 유발
      return
    }
    try {
      await axiosInstance.post('/account', formData)
      navigate('/login')
    } catch (error) {
      console.error('폼 제출 중 에러 발생', error)
    }
  }

  // 폼 전체 유효성 검사
  const validateForm = () => {
    return (
      validateUsername(formData.username) &&
      validatePassword(formData.password) &&
      formData.password === passwordConfirm
    )
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
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              이름
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="mt-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              아이디
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {errorMessages.username && (
              <div className="flex text-sm text-red-500">
                <ExclamationTriangleIcon className="mr-1 h-5 w-5" />
                {errorMessages.username}
              </div>
            )}
          </div>

          <div className="mt-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              이메일
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {errorMessages.email && (
              <div className="flex text-sm text-red-500">
                <ExclamationTriangleIcon className="mr-1 h-5 w-5" />
                {errorMessages.email}
              </div>
            )}
          </div>

          <div className="mt-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              패스워드
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {errorMessages.password && (
              <div className="flex text-sm text-red-500">
                <ExclamationTriangleIcon className="mr-1 h-5 w-5" />
                {errorMessages.password}
              </div>
            )}
          </div>

          <div className="mt-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              패스워드 확인
            </label>
            <input
              type="password"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {errorMessages.passwordConfirm && (
            <div className="flex text-sm text-red-500">
              <ExclamationTriangleIcon className="mr-1 h-5 w-5" />
              {errorMessages.passwordConfirm}
            </div>
          )}

          <div className="mt-5">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              회원 가입
            </button>
          </div>
        </form>
        <div key={notificationKey}>
          {showNotification && (
            <Alert title={notification.title} content={notification.content} />
          )}
        </div>
      </div>
    </div>
  )
}
export default SignUp
