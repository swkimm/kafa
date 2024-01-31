import axiosInstance from '@/commons/axios'
import Button from '@/components/buttons/Button'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const ModifyAssociation = () => {
  const location = useLocation()
  const association = location.state?.association
  const [name, setName] = useState(association.name)
  const [globalName, setGlobalName] = useState(association.globalName)
  const [initial, setInitial] = useState(association.initial)
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  const modifySubmit = async () => {
    const modifyData = {
      name: name,
      globalName: globalName,
      initial: initial
    }
    try {
      await axiosInstance.put(
        `/admin/associations/${association.id}`,
        modifyData
      )
      showNotification(
        NotificationType.Success,
        '협회 수정 성공',
        '협회 수정에 성공하였습니다.'
      )
      navigate(`/console/manage-association`)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '협회 수정 실패',
        '협회 수정에 실패하였습니다.',
        2500
      )
    }
  }

  return (
    <div className="m-5">
      <div className="bg-white p-5">
        <div className="mb-5 border-b border-l-8 border-l-black p-3 sm:flex-auto">
          <div>협회 수정</div>
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
        <Button label="수정" variant="roundLg" onClick={modifySubmit} />
      </div>
    </div>
  )
}

export default ModifyAssociation
