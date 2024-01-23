import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import Button from '@/components/buttons/Button'
import CreateModal from '@/components/modal/CreateModal'
import ModifyModal from '@/components/modal/ModifyModal'
import DefaultWithButtonTable from '@/components/tables/DefaultWithButtonTable'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { Dialog } from '@headlessui/react'
import { useCallback, useEffect, useState } from 'react'

const ManageAssociation = () => {
  const [associations, setAssociation] = useState<Association[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false)
  const [associationId, setAssociationId] = useState<number | null>(null)
  const { showNotification } = useNotification()

  const [name, setName] = useState('')
  const [globalName, setGlobalName] = useState('')
  const [initial, setInitial] = useState('')

  const getAssociations = useCallback(async () => {
    const page = 1
    const limit = 100
    try {
      const response = await axiosInstance.get(
        `/associations?page=${page}&limit=${limit}`
      )
      setAssociation(response.data)
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '협회 불러오기 실패',
        '협회 목록을 불러오는 실패하였습니다.',
        2500
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getAssociations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openCreateModal = () => setIsCreateModalOpen(true)
  const openModifyModal = () => setIsModifyModalOpen(true)

  const closeCreateModal = () => setIsCreateModalOpen(false)
  const closeModifyModal = () => setIsModifyModalOpen(false)

  const createAssociation = async () => {
    const createData = {
      name: name,
      globalName: globalName,
      initial: initial
    }
    try {
      await axiosInstance.post(`/admin/associations`, createData)
      closeCreateModal()
      getAssociations()
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '협회 생성 실패',
        '협회 생성에 실패하였습니다.',
        2500
      )
    }
  }

  const modifyAssociation = (association: Association) => {
    setAssociationId(association.id)
    setName(association.name)
    setGlobalName(association.globalName)
    setInitial(association.initial)
    openModifyModal()
  }

  const modifySubmit = async () => {
    const modifyData = {
      name: name,
      globalName: globalName,
      initial: initial
    }
    try {
      await axiosInstance.put(
        `/admin/associations/${associationId}`,
        modifyData
      )
      closeModifyModal()
      getAssociations()
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '협회 수정 실패',
        '협회 수정에 실패하였습니다.',
        2500
      )
    }
  }

  const deleteAssociation = async (associationId: number) => {
    try {
      await axiosInstance.delete(`/admin/associations/${associationId}`)
      getAssociations()
    } catch (error) {
      showNotification(
        NotificationType.Error,
        '협회 삭제 실패',
        '협회 삭제에 실패했습니다.',
        2500
      )
    }
  }

  const manageAssociationColumns = [
    {
      title: '로고',
      render: (association: Association) => (
        <div>
          {association.profileImgUrl ? (
            <div>
              <img src={association.profileImgUrl} alt={association.name} />
            </div>
          ) : (
            <div className="flex">
              <img src="/logo/KAFA_OG.png" alt="" className="w-10" />
            </div>
          )}
        </div>
      )
    },
    {
      title: '협회명',
      render: (association: Association) => <div>{association.name}</div>
    },
    {
      title: '협회명(영문)',
      render: (association: Association) => <div>{association.globalName}</div>
    },
    {
      title: '이니셜',
      render: (association: Association) => <div>{association.initial}</div>
    },
    {
      title: '수정',
      render: (association: Association) => (
        <Button
          label="수정"
          variant="roundLg"
          onClick={() => modifyAssociation(association)}
        />
      )
    },
    {
      title: '삭제',
      render: (association: Association) => (
        <Button
          label="삭제"
          variant="roundLg"
          onClick={() => deleteAssociation(association.id)}
        />
      )
    }
  ]

  useEffect(() => {
    getAssociations()
  }, [getAssociations])

  return (
    <div className="m-5">
      <DefaultWithButtonTable
        addButtonTitle="협회 추가"
        onAddButtonClick={openCreateModal}
        title={'협회 관리'}
        data={associations}
        columns={manageAssociationColumns}
      />

      {isModifyModalOpen && (
        <ModifyModal onClose={closeModifyModal} onSubmit={modifySubmit}>
          <div className="mt-3 p-5 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="mb-5 text-base font-semibold leading-6 text-gray-900"
            >
              협회 생성
            </Dialog.Title>
            <div className="overflow-y-auto text-left">
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
          </div>
        </ModifyModal>
      )}

      {isCreateModalOpen && (
        <CreateModal onClose={closeCreateModal} onSubmit={createAssociation}>
          <div className="mt-3 p-5 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="mb-5 text-base font-semibold leading-6 text-gray-900"
            >
              협회 생성
            </Dialog.Title>
            <div className="overflow-y-auto text-left">
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
          </div>
        </CreateModal>
      )}
    </div>
  )
}

export default ManageAssociation
