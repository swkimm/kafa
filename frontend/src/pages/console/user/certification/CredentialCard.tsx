import axiosInstance from '@/commons/axios'
import type { CertificationStatus } from '@/commons/interfaces/account/certification'
import {
  Gender,
  type Credential
} from '@/commons/interfaces/account/credential'
import {
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface CertificaionCardProps {
  status: CertificationStatus
}

const CredentialCard: React.FC<CertificaionCardProps> = ({ status }) => {
  const [credential, setCredential] = useState<Credential>()

  const printDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const getCredential = async () => {
      await axiosInstance.get('/account/credential').then((result) => {
        result.data.birthday = new Date(result.data.birthday)
        setCredential(result.data)
      })
    }

    getCredential()
  }, [])

  return (
    <div className="-mt-3 flex flex-col gap-y-2">
      {status.credential ? (
        <div className="flex flex-col text-sm">
          <div className="mb-3 flex flex-row items-center">
            <CheckCircleIcon className="h-6 w-6 pr-1.5 text-green-500" />
            <p>본인 인증을 완료했습니다</p>
          </div>
          {credential && (
            <div className="flex flex-col gap-y-0.5">
              <div className="flex flex-row justify-between">
                <p className="text-gray-400">실명</p>
                <p className="text-gray-900">{credential.name}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-gray-400">생년월일</p>
                <p className="text-gray-900">
                  {printDate(credential.birthday)}
                </p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-gray-400">성별</p>
                <p className="text-gray-900">
                  {credential.gender === Gender.Male ? '남성' : '여성'}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mb-3 flex flex-row items-center text-sm">
            <ExclamationCircleIcon className="h-6 w-6 pr-1.5 text-red-500" />
            <p>본인 인증이 완료되지 않았습니다</p>
          </div>
        </>
      )}
    </div>
  )
}

export default CredentialCard
