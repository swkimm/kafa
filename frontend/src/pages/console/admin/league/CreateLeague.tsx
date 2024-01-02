import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import DropdownLeft from '@/components/dropdown/DropdownLeft'
import Alert from '@/components/notifications/Alert'
import MyNotification from '@/components/notifications/Notification'
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
  const navigate = useNavigate()
  const [associations, setAssociations] = useState<Association[]>([])
  const [selectedAssociationId, setSelectedAssociationId] = useState<
    number | null
  >(null)
  const [leagueName, setLeagueName] = useState('')
  const [startedAt, setStartedAt] = useState<Date | null>(null)
  const [endedAt, setEndedAt] = useState<Date | null>(null)
  const [notification, setNotification] = useState({
    title: '',
    content: '',
    show: false
  })
  const [alert, setAlert] = useState({ title: '', content: '', show: false })

  const getAssociations = async () => {
    try {
      const response = await axiosInstance.get<Association[]>(
        '/associations?page=1&limit=100'
      )
      setAssociations(response.data)
    } catch (error) {
      console.error('협회 데이터 가져오기 오류:', error)
    }
  }

  useEffect(() => {
    getAssociations()
  }, [])

  const associationSelect = (selected: string) => {
    const association = associations.find((assoc) => assoc.name === selected)
    setSelectedAssociationId(association?.id || null)
  }

  const handleSubmit = async () => {
    const formatDate = (date: Date | null) => {
      return date ? date.toISOString().split('T')[0] : ''
    }

    // 알림 상태를 설정하고 일정 시간 후에 숨기는 함수
    const showAlert = (
      type: 'notification' | 'alert',
      title: string,
      content: string
    ) => {
      const newState = { title, content, show: true }
      if (type === 'notification') {
        setNotification(newState)
        setTimeout(() => setNotification({ ...newState, show: false }), 3000)
      } else if (type === 'alert') {
        setAlert(newState)
        setTimeout(() => setAlert({ ...newState, show: false }), 3000)
      }
    }

    if (selectedAssociationId === null) {
      showAlert('alert', '등록 실패', '협회를 선택하세요')
      return
    }
    try {
      const postData = {
        name: leagueName,
        startedAt: formatDate(startedAt),
        endedAt: formatDate(endedAt),
        associationId: selectedAssociationId
      }
      const response = await axiosInstance.post('/admin/leagues', postData)
      console.log('대회 등록 성공')
      showAlert(
        'notification',
        '등록 성공',
        '대회가 성공적으로 등록되었습니다.'
      )
      console.log(response.data.id)

      navigate(`/console/league/${response.data.id}/createGame`)
    } catch (error) {
      showAlert('alert', '등록 실패', '대회 등록 실패')
    }
  }

  return (
    <div className="m-5">
      <div className="text-md mb-5 font-bold">대회등록</div>
      <div className="bg-white p-5">
        <div className="border-b border-l-8 border-l-black p-3 sm:flex-auto">
          <div>대회 등록</div>
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
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          다음
        </button>
      </div>
      {notification.show && (
        <MyNotification
          title={notification.title}
          content={notification.content}
        />
      )}
      {alert.show && <Alert title={alert.title} content={alert.content} />}
    </div>
  )
}

export default RegisterLeague
