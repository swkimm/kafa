import { useEffect, useState } from 'react'

const UseTermItem: React.FC = () => {
  const [useTermText, setUseTermText] = useState('')

  useEffect(() => {
    fetch('/terms/use.txt')
      .then((response) => response.text())
      .then((text) => setUseTermText(text))
  })

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 lg:px-20">
      <h3 className="text-lg font-semibold leading-7 text-gray-900">
        이용약관
      </h3>
      <p className="mt-1 max-w-2xl text-base leading-6 text-gray-500">
        대한미식축구협회 홈페이지 이용약관입니다
      </p>
      <div className="mt-5">
        <div className="max-h-[400px] overflow-y-auto whitespace-pre-wrap rounded-md border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 sm:max-h-[640px]">
          <p>{useTermText}</p>
        </div>
      </div>
    </div>
  )
}

export default UseTermItem
