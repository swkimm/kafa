import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import type { League } from '@/commons/interfaces/league/league'
import Button from '@/components/buttons/Button'
import DropdownLeft from '@/components/dropdown/DropdownLeft'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useLocation, useNavigate } from 'react-router-dom'

const ModifyLeague = () => {
  const location = useLocation()
  const league = location.state?.league
  const [associations, setAssociations] = useState<Association[]>([])
  const [selectedAssociationName, setSelectedAssociationName] = useState('')
  const [startedAt, setStartedAt] = useState<Date | null>(
    new Date(league.startedAt)
  )
  const [endedAt, setEndedAt] = useState<Date | null>(new Date(league.endedAt))
  const [leagueName, setLeagueName] = useState(league.name)
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  const associationOptions = associations.map((assoc) => ({
    id: assoc.id,
    name: assoc.name
  }))

  const getAssociations = async () => {
    const response = await axiosInstance.get<Association[]>(
      '/associations?page=1&limit=100'
    )
    setAssociations(response.data)

    const initialAssociation = response.data.find(
      (assoc) => assoc.id === league.associationId
    )
    setSelectedAssociationName(initialAssociation?.name || '')
  }

  useEffect(() => {
    getAssociations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const associationSelect = (selected: string) => {
    setSelectedAssociationName(selected)
  }

  const handleUpdate = async () => {
    const updatedLeague: League = {
      id: league.id,
      name: leagueName,
      startedAt: startedAt ? new Date(startedAt) : new Date(),
      endedAt: endedAt ? new Date(endedAt) : new Date(),
      associationId:
        associations.find((a) => a.name === selectedAssociationName)?.id ??
        league.associationId
    }

    try {
      const updatePayload = {
        name: updatedLeague.name,
        startedAt: updatedLeague.startedAt.toISOString().split('T')[0],
        endedAt: updatedLeague.endedAt.toISOString().split('T')[0],
        associationId: updatedLeague.associationId
      }

      await axiosInstance.put(`/admin/leagues/${league.id}`, updatePayload)
      showNotification(
        NotificationType.Success,
        '대회 수정 성공',
        '대회 수정에 성공했습니다.'
      )
      navigate('/console/manage-league')
    } catch (error) {
      showNotification(
        NotificationType.Success,
        '대회 수정 실패',
        '대회 수정에 실패했습니다.'
      )
    }
  }

  return (
    <div className="m-5">
      <div className="bg-white p-5">
        <div className="border-b border-l-8 border-l-black p-3 sm:flex-auto">
          <div>리그 수정</div>
        </div>
        <div>
          <div className="mt-5 grid grid-cols-8 gap-y-3">
            <div className="col-span-1 flex items-center">
              <label
                htmlFor="association"
                className="text-sm font-medium leading-6 text-gray-900"
              >
                협회
              </label>
            </div>
            <div className="col-span-7 flex items-center">
              <DropdownLeft
                optionName={selectedAssociationName}
                optionList={associationOptions}
                onSelect={associationSelect}
              />
            </div>
            <div className="col-span-1 flex items-center">
              <label
                htmlFor="text"
                className="text-sm font-medium leading-6 text-gray-900"
              >
                대회명
              </label>
            </div>
            <div className="col-span-7 flex items-center">
              <input
                type="text"
                value={leagueName}
                onChange={(e) => setLeagueName(e.target.value)}
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="col-span-1 flex items-center">
              <label
                htmlFor="text"
                className="text-sm font-medium leading-6 text-gray-900"
              >
                대회 시작
              </label>
            </div>
            <div className="col-span-7 flex items-center">
              <div className="">
                <DatePicker
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  selected={startedAt}
                  onChange={(date: Date) => setStartedAt(date)}
                />
              </div>
            </div>
            <div className="col-span-1 flex items-center">
              <label
                htmlFor="text"
                className="text-sm font-medium leading-6 text-gray-900"
              >
                대회 종료
              </label>
            </div>
            <div className="col-span-7 flex items-center">
              <DatePicker
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                selected={endedAt}
                onChange={(date: Date) => setEndedAt(date)} // 날짜가 변경되면 상태 업데이트
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <Button label="수정" variant="roundLg" onClick={handleUpdate} />
      </div>
    </div>
  )
}

export default ModifyLeague
