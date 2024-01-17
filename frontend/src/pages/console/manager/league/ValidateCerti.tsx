import axiosInstance from '@/commons/axios'
import type {
  ApiResponse,
  RosterWithAvailability
} from '@/commons/interfaces/roster/rosterAvaliablity'
import DefaultTable from '@/components/tables/DefaultTable'
import { useEffect, useState } from 'react'

const ValidateCerti = () => {
  const [validation, setValidation] = useState<ApiResponse | null>(null)

  const getValidateCerti = async () => {
    try {
      const response = await axiosInstance.get<ApiResponse>(
        `/leagues/rosters/validation`
      )
      setValidation(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getValidateCerti()
  }, [])

  const rosterCertiColumns = [
    {
      title: '유효성',
      render: (roster: RosterWithAvailability) => {
        switch (roster.avaliability) {
          case 'Unverified':
            return <div>증명서 업로드 안됨</div>
          case 'Verified':
            return <div>증명서 업로드 됨</div>
          case 'Exemption':
            return <div>증명서 면제</div>
          default:
            return <div>상태 불명</div>
        }
      }
    },
    {
      title: '프로필',
      render: (validate: RosterWithAvailability) => (
        <div>
          {validate.profileImgUrl && validate.profileImgUrl !== null ? (
            <img
              src={validate.profileImgUrl}
              alt={validate.name}
              className="h-12 w-10"
            />
          ) : (
            <img src="/logo/KAFA_OG.png" alt="" className="h-12 w-10" />
          )}
        </div>
      )
    },
    {
      title: '이름',
      render: (validate: RosterWithAvailability) => <span>{validate.name}</span>
    },
    {
      title: '백넘버',
      render: (validate: RosterWithAvailability) => (
        <span>{validate.backNumber}</span>
      )
    },
    {
      title: '구분',
      render: (validate: RosterWithAvailability) => (
        <span>{validate.rosterType}</span>
      )
    },
    {
      title: '포지션',
      render: (validate: RosterWithAvailability) => {
        if (validate.position) {
          const { offence, defense, special } = validate.position
          const positions = [offence, defense, special]
            .filter(Boolean)
            .join('/')
          return <span>{positions}</span>
        }
        return null
      }
    }
  ]

  return (
    <div className="m-5">
      <div className="text-md mb-5 font-bold">로스터 인증서 검증</div>
      <div className="mb-5">
        {validation?.valid ? (
          <div className="text-blue-500">리그 신청 가능</div>
        ) : (
          <div className="text-red-500">
            리그 신청 불가능
            {validation?.reasons.map((reason, index) => (
              <div key={index} className="text-black">
                {reason}
              </div>
            ))}
          </div>
        )}
      </div>

      <DefaultTable
        title={'로스터'}
        data={validation?.rosters ?? []}
        columns={rosterCertiColumns}
      />
    </div>
  )
}

export default ValidateCerti
