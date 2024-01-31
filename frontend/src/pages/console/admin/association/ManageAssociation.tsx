import axiosInstance from '@/commons/axios'
import type { Association } from '@/commons/interfaces/association/association'
import Button from '@/components/buttons/Button'
import SimpleAlert from '@/components/notifications/SimpleAlert'
import DefaultWithButtonTable from '@/components/tables/DefaultWithButtonTable'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ManageAssociation = () => {
  const [associations, setAssociation] = useState<Association[]>([])
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [associationToDelete, setAssociationToDelete] = useState<number | null>(
    null
  )

  const handleDeleteClick = (associationId: number) => {
    setAssociationToDelete(associationId)
    setIsAlertOpen(true)
  }

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
  }, [getAssociations])

  const confirmDeleteAssociation = async (associationId: number) => {
    try {
      await axiosInstance.delete(`/admin/associations/${associationId}`)
      showNotification(
        NotificationType.Error,
        '협회 삭제 성공',
        '협회 삭제에 성공했습니다.',
        2500
      )
      setIsAlertOpen(false)
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
          onClick={() => goToModifyAssociation(association)}
        />
      )
    },
    {
      title: '삭제',
      render: (association: Association) => (
        <Button
          label="삭제"
          variant="roundLg"
          onClick={() => handleDeleteClick(association.id)}
        />
      )
    }
  ]

  useEffect(() => {
    getAssociations()
  }, [getAssociations])

  const goToModifyAssociation = (association: Association) => {
    navigate(`/console/modify-association`, { state: { association } })
  }

  const goToCreateAssociation = () => {
    navigate(`/console/create-association`)
  }

  return (
    <div className="m-5">
      <DefaultWithButtonTable
        addButtonTitle="협회 추가"
        onAddButtonClick={goToCreateAssociation}
        title={'협회 관리'}
        data={associations}
        columns={manageAssociationColumns}
      />
      {isAlertOpen && (
        <SimpleAlert
          open={isAlertOpen}
          onCancel={() => setIsAlertOpen(false)}
          onConfirm={() =>
            associationToDelete !== null
              ? confirmDeleteAssociation(associationToDelete)
              : null
          }
        />
      )}
    </div>
  )
}

export default ManageAssociation
