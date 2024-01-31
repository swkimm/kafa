import axiosInstance from '@/commons/axios'
import Button from '@/components/buttons/Button'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateAssociation = () => {
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [globalName, setGlobalName] = useState('')
  const [initial, setInitial] = useState('')

  const createAssociation = async () => {
    const createData = {
      name: name,
      globalName: globalName,
      initial: initial
    }
    try {
      await axiosInstance.post(`/admin/associations`, createData)
      showNotification(
        NotificationType.Success,
        '협회 생성 성공',
        '협회 생성에 성공하였습니다.'
      )
      navigate(`/console/manage-association`)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '협회 생성 실패',
        '협회 생성에 실패하였습니다.',
        2500
      )
    }
  }

  return (
    <div className="m-5">
      <div className="bg-white p-5">
        <div className="mb-5 border-b border-l-8 border-l-black p-3 sm:flex-auto">
          <div>게임 생성</div>
        </div>
        <div className="relative mb-5 grid grid-cols-6 items-center">
          <div className="col-span-2">협회명</div>
          <div className="col-span-4 mb-2">
            <input
              value={name}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-span-2">협회명(영문)</div>
          <div className="col-span-4 mb-2">
            <input
              value={globalName}
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setGlobalName(e.target.value)}
            />
          </div>
          <div className="col-span-2">이니셜</div>
          <div className="col-span-4 mb-2">
            <input
              value={initial}
              placeholder="영문 대문자로만 입력해주세요"
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setInitial(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <Button variant="roundLg" label="생성" onClick={createAssociation} />
      </div>
    </div>
  )
}

export default CreateAssociation
