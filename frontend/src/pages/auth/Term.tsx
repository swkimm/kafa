import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface TermProps {}

const Term: React.FC<TermProps> = () => {
  const navigate = useNavigate()
  const [useTermText, setUseTermText] = useState('')
  const [personalInfoTermText, setPersonalInfoTermText] = useState('')
  const [aggrement, setAgreement] = useState({
    use: false,
    personalInfo: false
  })

  const { showNotification } = useNotification()

  useEffect(() => {
    fetch('/terms/use.txt')
      .then((response) => response.text())
      .then((text) => setUseTermText(text))

    fetch('/terms/personal-info.txt')
      .then((response) => response.text())
      .then((text) => setPersonalInfoTermText(text))
  }, [])

  const handleSubmit = () => {
    if (aggrement.use && aggrement.personalInfo) {
      navigate('?termUse=Y&termPersonalInfo=Y')
    } else {
      showNotification(
        NotificationType.Error,
        '동의 안함',
        '필수 항목에 동의하지 않았습니다'
      )
    }
  }

  return (
    <div className="flex flex-col gap-y-8">
      <div>
        <button onClick={() => navigate('/')}>
          <img className="mx-auto h-32" src="./logo/logo.png" alt="TBD" />
        </button>
      </div>
      <div>
        <div className="mb-2">
          <p className="font-medium text-gray-900">
            <span className="text-red-600">[필수]</span> 이용약관
          </p>
        </div>
        <div className="max-h-[200px] overflow-y-auto whitespace-pre-wrap rounded-md border border-gray-200 px-3 py-3 text-xs font-light text-gray-400">
          <p>{useTermText}</p>
        </div>
        <div className="relative mt-1 flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="agree-use-term"
              name="agree-use-term"
              type="checkbox"
              onChange={(event) =>
                setAgreement({ ...aggrement, use: event.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-indigo-950 focus:ring-indigo-950"
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label
              htmlFor="agree-use-term"
              className="font-medium text-gray-900"
            >
              동의
            </label>
            <p className="text-xs text-gray-400">
              이용약관을 읽었으며 이에 동의합니다
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-2">
          <p className="font-medium text-gray-900">
            <span className="text-red-600">[필수]</span> 개인정보 처리방침
          </p>
        </div>
        <div className="max-h-[200px] overflow-y-auto whitespace-pre-wrap rounded-md border border-gray-200 px-3 py-3 text-xs font-light text-gray-400">
          <p>{personalInfoTermText}</p>
        </div>
        <div className="relative mt-1 flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="agree-personal-info-term"
              name="agree-personal-info-term"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-950 focus:ring-indigo-950"
              onChange={(event) =>
                setAgreement({
                  ...aggrement,
                  personalInfo: event.target.checked
                })
              }
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label
              htmlFor="agree-personal-info-term"
              className="font-medium text-gray-900"
            >
              동의
            </label>
            <p className="text-xs text-gray-400">
              개인정보 처리방침을 읽었으며 이에 동의합니다
            </p>
          </div>
        </div>
      </div>
      <button
        className="flex w-full justify-center rounded-md bg-indigo-950 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-900"
        onClick={handleSubmit}
      >
        다음
      </button>
    </div>
  )
}

export default Term
