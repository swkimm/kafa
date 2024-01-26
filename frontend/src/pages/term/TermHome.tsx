import { Disclosure } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import EmailRejectTerm from './item/EmailRejectTermItem'
import PersonalInfoTermItem from './item/PersonalInfoTermItem'
import UseTermItem from './item/UseTermItem'

const TermHome = () => {
  const location = useLocation()
  const [type, setType] = useState('이용약관')
  const navigate = useNavigate()

  useEffect(() => {
    const type = new URLSearchParams(location.search).get('type')
    setType(type ?? '이용약관')
  }, [location.search])

  const renderComponent = () => {
    if (type === '이용약관') {
      return <UseTermItem />
    } else if (type === '개인정보처리방침') {
      return <PersonalInfoTermItem />
    } else if (type === '이메일무단수집거부') {
      return <EmailRejectTerm />
    }
  }
  return (
    <div className="">
      <Disclosure as="nav" className="w-full bg-purple-950 shadow">
        <>
          <div className="mx-auto max-w-screen-xl px-4 lg:px-20">
            <div className="flex h-20 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center text-sm font-bold text-gray-50 sm:text-base">
                  약관
                </div>
                <div className="ml-4 flex gap-x-2 sm:ml-6 sm:gap-x-8">
                  <Disclosure.Button
                    as="button"
                    className={`inline-flex items-center px-1 pt-1 text-xs font-medium text-gray-50 sm:text-sm ${
                      type === '이용약관'
                        ? 'border-b-2 border-gray-50'
                        : 'border-b-2 border-transparent hover:border-gray-50 hover:text-black'
                    }`}
                    onClick={() => navigate('/term?type=이용약관')}
                  >
                    이용약관
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    className={`inline-flex items-center px-1 pt-1 text-xs font-medium text-gray-50 sm:text-sm ${
                      type === '개인정보처리방침'
                        ? 'border-b-2 border-gray-50'
                        : 'border-b-2 border-transparent hover:border-gray-50 hover:text-black'
                    }`}
                    onClick={() => navigate('/term?type=개인정보처리방침')}
                  >
                    개인정보처리방침
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    className={`inline-flex items-center px-1 pt-1 text-xs font-medium sm:text-sm ${
                      type === '이메일무단수집거부'
                        ? 'border-b-2 border-white text-white'
                        : 'border-b-2 border-transparent text-white hover:border-white hover:text-black'
                    }`}
                    onClick={() => navigate('/term?type=이메일무단수집거부')}
                  >
                    이메일무단수집거부
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>
        </>
      </Disclosure>
      {renderComponent()}
    </div>
  )
}

export default TermHome
