import axiosInstance from '@/commons/axios'
import type { Profile } from '@/commons/interfaces/account/profile'
import ModalConatiner from '@/components/modal/ModalConatiner'
import useNotification from '@/hooks/useNotification'
import { NotificationType } from '@/state/notificationState'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface ChangeProfileModalProps {
  profileInit: Profile
  isModalOpen: boolean
  closeModal: () => void
  onProfileUpdate: (newProfile: Profile) => void
}

const ChangeProfileModal: React.FC<ChangeProfileModalProps> = ({
  profileInit,
  closeModal,
  isModalOpen,
  onProfileUpdate
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState(profileInit.name)
  const [email, setEmail] = useState(profileInit.email)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [image, setImage] = useState<any>()
  const { showNotification } = useNotification()

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      if (file && file.type.match('image.*')) {
        const reader = new FileReader()
        reader.onload = (event: ProgressEvent<FileReader>) => {
          setImage(event.target?.result)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const onSubmit = async () => {
    setIsSubmitting(true)
    const updatedProfile: Profile = await axiosInstance
      .put('/account/profile', {
        name,
        email
      })
      .then((result) => {
        onProfileUpdate(result.data as Profile)
        return result.data
      })
      .catch(() => {
        showNotification(
          NotificationType.Error,
          '업데이트 실패',
          '올바른 값을 입력했는지 확인해주세요'
        )
        return false
      })

    if (!updatedProfile) return

    const formData = new FormData()
    const fileInput = document.getElementById('image') as HTMLInputElement

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0]
      formData.append('image', file)

      await axiosInstance
        .post('/profile/account', formData)
        .then((response) => {
          onProfileUpdate({ ...updatedProfile, profileImgUrl: response.data })
          closeModal()
          showNotification(
            NotificationType.Success,
            '업데이트 성공',
            '프로필 정보가 업데이트 되었습니다'
          )
        })
        .catch(() => {
          showNotification(
            NotificationType.Error,
            '프로필 이미지 업데이트 실패',
            '프로필 이미지가 변경되지 않았습니다'
          )
          closeModal()
        })
        .finally(() => {
          setImage(null)
        })
    } else {
      showNotification(
        NotificationType.Success,
        '업데이트 성공',
        '프로필 정보가 업데이트 되었습니다'
      )
      closeModal()
    }

    setIsSubmitting(false)
  }

  return (
    <ModalConatiner isOpen={isModalOpen}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-5">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            프로필 변경하기
          </h2>
          <div className="mt-7">
            <div className="mb-5">
              <label
                htmlFor="name"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                이름
              </label>
              <div className="mt-2">
                <div className="flex w-full rounded-md border border-gray-300 shadow-sm">
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={onNameChange}
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 ring-0 placeholder:text-gray-400 focus:border-0 focus:ring-0 sm:text-sm sm:leading-6"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                이메일
              </label>
              <div className="mt-2">
                <div className="flex w-full rounded-md border border-gray-300 shadow-sm">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onEmailChange}
                    id="email"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
            <div className="">
              <label
                htmlFor="image"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                프로필 사진
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-3">
                <div className="text-center">
                  <div>
                    {image ? (
                      <img
                        src={image}
                        alt="ProfileImage"
                        className="mx-auto mt-4 max-h-16 w-auto sm:max-h-28"
                      />
                    ) : (
                      <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative mx-auto flex cursor-pointer items-center rounded-md bg-white text-xs font-semibold text-indigo-900 focus-within:outline-none hover:text-indigo-800 sm:text-sm"
                    >
                      <span>사진 업로드</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        className="sr-only"
                        onChange={onImageChange}
                        disabled={isSubmitting}
                      />
                      <p className="pl-1 text-gray-600">또는 드래그앤 드랍</p>
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-x-1.5">
        <button
          disabled={isSubmitting}
          onClick={onSubmit}
          className="inline-flex items-center rounded-md bg-indigo-950 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
        >
          변경하기
        </button>
        <button
          onClick={closeModal}
          className="inline-flex items-center rounded-md border border-black bg-white px-4 py-2.5 text-xs font-semibold text-black shadow-md hover:bg-gray-100 sm:text-sm"
        >
          돌아가기
        </button>
      </div>
    </ModalConatiner>
  )
}

export default ChangeProfileModal
