import axiosInstance from '@/commons/axios'
import type {
  CertificaionFile,
  CertificationStatus
} from '@/commons/interfaces/account/certification'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import {
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface CertificaionCardProps {
  status: CertificationStatus
  onStatusChange: (status: CertificationStatus) => void
}

const CertificationCard: React.FC<CertificaionCardProps> = ({
  status,
  onStatusChange
}) => {
  const [certificationFileInfo, setCertificaionFileInfo] =
    useState<CertificaionFile>()
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { showNotification } = useNotification()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    const file = files && files.length > 0 ? files[0] : null
    setFile(file)
  }

  const handleSubmit = async () => {
    if (file) {
      setIsSubmitting(true)
      const data = new FormData()
      data.append('file', file)

      await axiosInstance
        .post('/account/certification', data)
        .then((result) => {
          result.data.updatedAt = new Date(result.data.updatedAt)
          onStatusChange({ ...status, certification: true })
          setCertificaionFileInfo(result.data)
          showNotification(
            NotificationType.Success,
            '업로드 성공',
            '증명서가 업로드 되었습니다'
          )
        })
        .catch(() =>
          showNotification(
            NotificationType.Error,
            '업로드 실패',
            '증명서를 업로드 하지 못했습니다'
          )
        )
        .finally(() => {
          setFile(null)
          setIsSubmitting(false)
        })
    } else {
      showNotification(
        NotificationType.Warning,
        '선택된 파일 없음',
        '파일 선택후 다시 시도해주세요'
      )
    }
  }

  const getCloudFrontToken = async () => {
    try {
      await axiosInstance.get('/auth/certification')
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '토큰 발급 에러',
        '인증서 접근을 위한 보안 토큰 발급에 실패했습니다'
      )
      throw new Error()
    }
  }

  const handleViewCertificaitonFile = async (url: string) => {
    const token = await getCloudFrontToken()
      .then(() => true)
      .catch(() => false)

    if (!token) return

    window.open(url)
  }

  useEffect(() => {
    const getCertficationFileInfo = async () => {
      const certificationFile: CertificaionFile = await axiosInstance
        .get('/account/certification')
        .then((result) => result.data)

      certificationFile.updatedAt = new Date(certificationFile.updatedAt)

      setCertificaionFileInfo(certificationFile)
    }

    getCertficationFileInfo()
  }, [])

  return (
    <div className="-mt-3 flex flex-col gap-y-2">
      {status.certification ? (
        <>
          <div className="mb-3 flex items-center text-sm">
            <CheckCircleIcon className="h-6 w-6 pr-1.5 text-green-500" />
            <p>증명서가 업로드 되어있습니다</p>
          </div>
        </>
      ) : (
        <>
          <div className="mb-3 flex items-center text-sm">
            <ExclamationCircleIcon className="h-6 w-6 pr-1.5 text-red-500" />
            <p>증명서가 업로드 되어있지 않습니다</p>
          </div>
        </>
      )}
      {certificationFileInfo && (
        <div className="flex flex-row items-center justify-between text-sm">
          <p className="text-gray-400">마지막 업로드</p>
          <p className="pl-1.5 text-gray-900">
            {certificationFileInfo.updatedAt.toLocaleString('ko')}
          </p>
        </div>
      )}
      <div className="flex flex-row items-center justify-between">
        <label
          htmlFor="file_input"
          className="flex-shrink-0 pr-10 text-sm text-gray-400"
        >
          증명서 업로드
        </label>
        <input
          className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
          aria-describedby="file_input_help"
          id="file_input"
          type="file"
          disabled={isSubmitting}
          onChange={handleFileChange}
        />
      </div>
      <div className="mt-4 flex flex-row items-center justify-end gap-x-1.5">
        {certificationFileInfo ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
            >
              증명서 교체
            </button>
            <button
              className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
              onClick={() =>
                handleViewCertificaitonFile(certificationFileInfo.fileUrl)
              }
            >
              증명서 조회
            </button>
          </>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
          >
            증명서 업로드
          </button>
        )}
      </div>
    </div>
  )
}

export default CertificationCard
