import axiosInstance from '@/commons/axios'
import { printRole } from '@/commons/functions/role/role.print'
import type { Profile } from '@/commons/interfaces/account/profile'
import ConsoleCard from '@/components/cards/ConsoleCard'
import { useEffect, useState } from 'react'
import ChangeProfileModal from './ChangeProfileModal'

const CurrentProfileCard: React.FC = () => {
  const [profile, setProfile] = useState<Profile>()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const onProfileUpdate = (newProfile: Profile) => {
    setProfile({ ...profile, ...newProfile })
  }

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axiosInstance.get(`/account/profile`)
        setProfile(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    getProfile()
  }, [])

  return (
    <>
      {profile ? (
        <ChangeProfileModal
          profileInit={profile}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          onProfileUpdate={onProfileUpdate}
        />
      ) : null}
      <ConsoleCard
        title={'내 프로필'}
        subtitle={'현재 로그인한 계정의 프로필 정보'}
      >
        {profile ? (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-gray-900">프로필 사진</p>
              <div className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-50 sm:h-10 sm:w-10">
                {profile.profileImgUrl ? (
                  <img className="h-full w-full" src={profile.profileImgUrl} />
                ) : (
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
            </div>
            <div className="mb-1 flex justify-between">
              <p className="text-sm text-gray-900">닉네임</p>
              <p className="text-sm font-medium">{profile.name}</p>
            </div>
            <div className="mb-1 flex justify-between">
              <p className="text-sm text-gray-900">이메일</p>
              <p className="text-sm font-medium">{profile.email}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-900">권한</p>
              <p className="text-sm font-medium">{printRole(profile.role)}</p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center rounded-md bg-indigo-950 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-900 sm:text-sm"
              >
                수정하기
              </button>
            </div>
          </div>
        ) : null}
      </ConsoleCard>
    </>
  )
}

export default CurrentProfileCard
