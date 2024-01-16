import axiosInstance from '@/commons/axios'
import type { Profile } from '@/commons/interfaces/account/profile'
import { UserCircleIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'

const MyProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null)

  const getProfile = async () => {
    try {
      const response = await axiosInstance.get(`/account/profile`)
      setProfile(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  return (
    <div className="m-5">
      <div className="text-md mb-5 font-bold">프로필</div>
      <div className="bg-white p-5">
        <div className="grid grid-cols-8 gap-3">
          <div className="col-span-1 flex items-center">
            <label className="text-sm font-medium leading-6 text-gray-900">
              프로필
            </label>
          </div>
          <div className="col-span-7">
            {!profile?.profileImgUrl ? (
              <UserCircleIcon className="h-auto w-40 text-gray-500" />
            ) : (
              <img src={profile.profileImgUrl} alt={profile.name} />
            )}
          </div>
          <div className="col-span-1 flex items-center">
            <label className="text-sm font-medium leading-6 text-gray-900">
              이름
            </label>
          </div>
          <div className="col-span-7">{profile?.name}</div>
          <div className="col-span-1 flex items-center">
            <label className="text-sm font-medium leading-6 text-gray-900">
              이메일
            </label>
          </div>
          <div className="col-span-7">{profile?.email}</div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
