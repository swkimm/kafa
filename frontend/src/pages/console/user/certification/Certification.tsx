import axiosInstance from '@/commons/axios'
import type { CertificationStatus } from '@/commons/interfaces/account/certification'
import ConsoleCard from '@/components/cards/ConsoleCard'
import { useEffect, useState } from 'react'
import CertificationCard from './CertificationCard'
import CredentialCard from './CredentialCard'
import EmailCard from './EmailCard'

const Certification: React.FC = () => {
  const [certificationStatus, setCertificationStatus] =
    useState<CertificationStatus>({
      email: false,
      credential: false,
      certification: false
    })

  const onStatusChange = (status: CertificationStatus) => {
    setCertificationStatus(status)
  }

  useEffect(() => {
    const getCertificationStatus = async () => {
      const certificationStatus: CertificationStatus = await axiosInstance
        .get('/account/status')
        .then((result) => result.data)

      setCertificationStatus(certificationStatus)
    }

    getCertificationStatus()
  }, [])

  return (
    <div className="m-0 h-full w-full sm:p-5">
      <div className="text-md mb-5 px-4 pt-5 font-bold sm:px-0 sm:pt-0">
        인증 관리
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 lg:col-span-1">
          <ConsoleCard title="이메일" subtitle="이메일 인증 정보 관리">
            <EmailCard
              onStatusChange={onStatusChange}
              status={certificationStatus}
            />
          </ConsoleCard>
        </div>
        <div className="col-span-3 lg:col-span-1">
          <ConsoleCard title="개인정보" subtitle="본인 인증 정보 관리">
            <CredentialCard status={certificationStatus} />
          </ConsoleCard>
        </div>
        <div className="col-span-3 lg:col-span-1">
          <ConsoleCard
            title="증명서"
            subtitle="증명서 파일(신분증, 재적증명서 등) 관리"
          >
            <CertificationCard
              onStatusChange={onStatusChange}
              status={certificationStatus}
            />
          </ConsoleCard>
        </div>
      </div>
    </div>
  )
}

export default Certification
