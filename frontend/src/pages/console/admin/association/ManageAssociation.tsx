import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import Button from '@/components/buttons/Button'
import CreateModal from '@/components/modal/CreateModal'
import ModifyModal from '@/components/modal/ModifyModal'
import DefaultWithButtonTable from '@/components/tables/DefaultWithButtonTable'
import { Dialog } from '@headlessui/react'
import { useEffect, useState } from 'react'

const ManageAssociation = () => {
  const [associations, setAssociation] = useState<Association[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false)

  const [associationId, setAssociationId] = useState<number | null>(null)

  const [name, setName] = useState('')
  const [globalName, setGlobalName] = useState('')
  const [initial, setInitial] = useState('')

  const getAssociations = async () => {
    const page = 1
    const limit = 100
    try {
      const response = await axiosInstance.get(
        `/associations?page=${page}&limit=${limit}`
      )
      console.log(response.data)
      setAssociation(response.data)
    } catch (error) {
      console.log(error)
    }
  }

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
      console.log(error)
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
    console.log(modifyData)
    try {
      const response = await axiosInstance.put(
        `/admin/associations/${associationId}`,
        modifyData
      )
      console.log(response.data)

      closeModifyModal()
      getAssociations()
    } catch (error) {
      console.log(error)
    }
  }

  const deleteAssociation = async (associationId: number) => {
    try {
      const response = await axiosInstance.delete(
        `/admin/associations/${associationId}`
      )
      console.log(response.data)
      getAssociations()
    } catch (error) {
      console.log(error)
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
  }, [])

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
