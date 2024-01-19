import type { CertificationStatus } from '@/commons/interfaces/account/certification'
import {
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

interface CertificationProps {
  status: CertificationStatus
}

const AccountCertificationStatus: React.FC<CertificationProps> = ({
  status
}) => {
  const stats = [
    {
      name: '이메일 인증',
      status: status.email
    },
    {
      name: '본인 인증',
      status: status.credential
    },
    {
      name: '증명서 업로드',
      status: status.certification
    }
  ]

  return (
    <div>
      <dl className="grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200/60 bg-gray-100 md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map((item) => (
          <div key={item.name} className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-normal text-gray-900">{item.name}</dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              {item.status ? (
                <div className="flex items-center text-base font-semibold text-green-500 lg:text-xl">
                  <CheckCircleIcon className="mr-1.5 h-6 w-6" />
                  <p>완료</p>
                </div>
              ) : (
                <div className="flex items-center text-base font-semibold text-red-500 lg:text-xl">
                  <ExclamationCircleIcon className="mr-1.5 h-6 w-6" />
                  <p>미완료</p>
                </div>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default AccountCertificationStatus
