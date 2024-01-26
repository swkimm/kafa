import { useEffect, useState } from 'react'

const PersonalInfoTermItem: React.FC = () => {
  const [termText, setTermText] = useState('')

  useEffect(() => {
    fetch('/terms/personal-info.txt')
      .then((response) => response.text())
      .then((text) => setTermText(text))
  })

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 lg:px-20">
      <h3 className="text-lg font-semibold leading-7 text-gray-900">
        개인정보처리방침
      </h3>
      <p className="mt-1 max-w-2xl text-base leading-6 text-gray-500">
        대한미식축구협회 홈페이지 개인정보처리방침입니다
      </p>
      <div className="mt-5">
        <div className="max-h-[400px] overflow-y-auto whitespace-pre-wrap rounded-md border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 sm:max-h-[640px]">
          <p>{termText}</p>
        </div>
      </div>
    </div>
  )
}

export default PersonalInfoTermItem
