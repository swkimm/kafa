import axiosInstance from '@/commons/axios'
import type { RosterValidationReport } from '@/commons/interfaces/roster/rosterAvaliablity'
import ConsoleCard from '@/components/cards/ConsoleCard'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import RosterReportList from './RosterReportList'

const ValidateRoster: React.FC = () => {
  const [validationReport, setValidationReport] =
    useState<RosterValidationReport>()

  useEffect(() => {
    const getValidationReport = async () => {
      await axiosInstance
        .get(`/leagues/rosters/validation`)
        .then((response) => setValidationReport(response.data))
    }
    getValidationReport()
  }, [])

  return (
    <div className="m-0 h-full w-full sm:p-5">
      <div className="text-md mb-5 px-4 pt-5 font-bold sm:px-0 sm:pt-0">
        로스터 검증
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 lg:col-span-2">
          <ConsoleCard
            title="로스터 검증"
            subtitle="로스터의 증명서 업로드 상태 확인"
          >
            {validationReport && (
              <div className="-mt-3 flex flex-col gap-y-2">
                <div className="-ml-0.5 flex w-full items-center text-sm">
                  {validationReport.valid ? (
                    <>
                      <CheckCircleIcon className="h-6 w-6 pr-1.5 text-green-500" />
                      <p>현재 팀에 활성화된 모든 로스터에 증명서가 있습니다</p>
                    </>
                  ) : (
                    <>
                      <ExclamationTriangleIcon className="h-6 w-6 pr-1.5 text-red-500" />
                      <p>현재 팀에 활성화된 일부 로스터에 증명서가 없습니다</p>
                    </>
                  )}
                </div>
                <RosterReportList reports={validationReport.rosters} />
              </div>
            )}
          </ConsoleCard>
        </div>
        <div className="col-span-3 lg:col-span-1">
          {validationReport && !validationReport.valid && (
            <ConsoleCard title="상세 결과" subtitle="문제가 있는 항목 리스트">
              <ul className="-mt-3 text-left text-sm text-gray-500">
                {validationReport.reasons.map((reason, index) => {
                  return (
                    <li key={index + 1}>
                      <div className="flex flex-row items-center gap-x-1.5">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        <p>{reason}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </ConsoleCard>
          )}
        </div>
      </div>
    </div>
  )
}

export default ValidateRoster
