import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import Button from '@/components/buttons/Button'
import DropdownLeft from '@/components/dropdown/DropdownLeft'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from 'react-router-dom'

interface RegisterLeague {
  name: string
  startedAt: Date
  endedAt: Date
  associationId: number
}

const RegisterLeague = () => {
  const [associations, setAssociations] = useState<Association[]>([])
  const [selectedAssociationId, setSelectedAssociationId] = useState<
    number | null
  >(null)
  const [leagueName, setLeagueName] = useState('')
  const [startedAt, setStartedAt] = useState<Date | null>(null)
  const [endedAt, setEndedAt] = useState<Date | null>(null)
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  const getAssociations = async () => {
    try {
      const response = await axiosInstance.get<Association[]>(
        '/associations?page=1&limit=100'
      )
      setAssociations(response.data)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '협회 불러오기 실패',
        '협회 불러오기에 실패했습니다.'
      )
    }
  }

  useEffect(() => {
    getAssociations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const associationSelect = (selected: string) => {
    const association = associations.find((assoc) => assoc.name === selected)
    setSelectedAssociationId(association?.id || null)
  }

  const handleSubmit = async () => {
    const formatDate = (date: Date | null) => {
      return date ? date.toISOString().split('T')[0] : ''
    }

    if (selectedAssociationId === null) {
      showNotification(
        NotificationType.Error,
        '대회 생성 실패',
        '협회를 선택하세요.'
      )
      return
    }
    try {
      const postData = {
        name: leagueName,
        startedAt: formatDate(startedAt),
        endedAt: formatDate(endedAt),
        associationId: selectedAssociationId
      }
      await axiosInstance.post('/admin/leagues', postData)
      showNotification(
        NotificationType.Success,
        '대회 생성 성공',
        '대회 생성에 성공했습니다.'
      )
      navigate('/console/manage-league')
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '대회 생성 실패',
        '대회 생성에 실패했습니다.'
      )
    }
  }

  return (
    <div className="m-5">
      <div className="bg-white p-5">
        <div className="border-b border-l-8 border-l-black p-3 sm:flex-auto">
          <div>리그 생성</div>
        </div>
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
              optionName="협회를 선택하세요"
              optionList={associations}
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
            <div>
              <DatePicker
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                selected={startedAt}
                onChange={(date: Date | null) => setStartedAt(date)}
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
              onChange={(date: Date | null) => setEndedAt(date)}
            />
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <Button label="생성" variant="roundLg" onClick={handleSubmit} />
      </div>
    </div>
  )
}

export default RegisterLeague
