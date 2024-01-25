import axiosInstance from '@/commons/axios'
import type { Profile } from '@/commons/interfaces/account/profile'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import {
  EnvelopeIcon,
  LockClosedIcon,
  TagIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

interface AccountForm {
  name: string
  username: string
  password: string
  email: string
}

const schema = yup.object().shape({
  name: yup.string().required('닉네임을 입력하지 않았습니다'),
  username: yup
    .string()
    .required('아이디를 입력하지 않았습니다')
    .matches(/^[a-zA-Z0-9]*$/, '아이디는 알파벳과 숫자만 사용할 수 있습니다'),
  password: yup
    .string()
    .required('비밀번호를 입력하지 않았습니다')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/\d/, '비밀번호에는 숫자가 포함되어야 합니다.')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      '비밀번호에는 특수 문자가 포함되어야 합니다.'
    ),
  email: yup
    .string()
    .required('이메일을 입력하지 않았습니다')
    .email('유효한 이메일 주소를 입력해주세요.')
})

const AccountInfo: React.FC = () => {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AccountForm>({
    resolver: yupResolver(schema)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: AccountForm) => {
    try {
      setIsSubmitting(true)
      const response: { data: Profile } = await axiosInstance.post(
        '/account',
        data
      )
      navigate(
        `/signup/email-verification?email=${response.data.email}&accountId=${response.data.id}`
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response.status === 409) {
        showNotification(
          NotificationType.Error,
          '계정정보중복',
          '중복되는 아이디 또는 이메일이 존재합니다',
          3000
        )
      } else {
        showNotification(
          NotificationType.Error,
          '회원가입 실패',
          '계정을 등록하는 중 오류가 발생했습니다'
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-y-8">
      <div>
        <button onClick={() => navigate('/')}>
          <img className="mx-auto h-32" src="./logo/logo.png" alt="TBD" />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="isolate mt-6 -space-y-px rounded-md shadow-sm">
          {/* Username Field */}
          <div className="relative flex flex-row items-center rounded-md rounded-b-none px-3 py-3 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-950">
            <label
              htmlFor="username"
              className="sr-only block text-xs font-medium text-gray-600"
            >
              아이디
            </label>
            <UserIcon
              className="mr-2 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="text"
              {...register('username')}
              className="w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0"
              placeholder="아이디"
            />
          </div>

          {/* Name Field */}
          <div className="relative flex flex-row items-center rounded-md rounded-b-none rounded-t-none px-3 py-3 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-950">
            <label
              htmlFor="name"
              className="sr-only block text-xs font-medium text-gray-600"
            >
              닉네임
            </label>
            <TagIcon
              className="mr-2 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="text"
              {...register('name')}
              className="w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0"
              placeholder="닉네임"
              id="name"
            />
          </div>

          {/* Password Field */}
          <div className="relative flex flex-row items-center rounded-md rounded-b-none rounded-t-none px-3 py-3 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-950">
            <label
              htmlFor="password"
              className="sr-only block text-xs font-medium text-gray-600"
            >
              패스워드
            </label>
            <LockClosedIcon
              className="mr-2 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="password"
              {...register('password')}
              className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="비밀번호"
              id="password"
            />
          </div>

          {/* Email Field */}
          <div className="relative flex flex-row items-center rounded-md rounded-t-none px-3 py-3 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-950">
            <label
              htmlFor="email"
              className="sr-only block text-xs font-medium text-gray-600"
            >
              이메일
            </label>
            <EnvelopeIcon
              className="mr-2 inline h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="email"
              {...register('email')}
              className="inline w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="이메일"
              id="email"
            />
          </div>
        </div>
        <div className="mt-2">
          {/* Error Forms */}
          <ul>
            <li>
              <p className="text-xs text-red-500">{errors.username?.message}</p>
            </li>
            <li>
              <p className="text-xs text-red-500">{errors.name?.message}</p>
            </li>
            <li>
              <p className="text-xs text-red-500">{errors.password?.message}</p>
            </li>
            <li>
              <p className="text-xs text-red-500">{errors.email?.message}</p>
            </li>
          </ul>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full rounded-md bg-indigo-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:ring-offset-2"
          >
            이메일 주소 인증하기
          </button>
        </div>
      </form>
    </div>
  )
}

export default AccountInfo
