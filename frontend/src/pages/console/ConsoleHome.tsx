import type { RootState } from '@/app/store'
import axiosInstance from '@/commons/axios'
import type { Profile } from '@/commons/interfaces/account/profile'
import { UserCircleIcon } from '@heroicons/react/20/solid'
import { ArrowTrendingUpIcon } from '@heroicons/react/20/solid'
import { CalendarIcon } from '@heroicons/react/20/solid'
import { DocumentCheckIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ConsoleHome = () => {
  const { role } = useSelector((state: RootState) => state.auth)
  const [profile, setProfile] = useState<Profile | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getRole = async () => {
      try {
        await axiosInstance.get('account/role')
      } catch (error) {
        console.error('Error', error)
      }
    }

    const getProfile = async () => {
      try {
        const response = await axiosInstance.get('/account/profile')
        setProfile(response.data)
      } catch (error) {
        console.error('Error', error)
      }
    }
    getRole()
    getProfile()
  }, [])

  const goToAdminNotice = () => {
    navigate('')
  }

  const goToAdminHuddle = () => {
    navigate('')
  }

  const goToAdminCalendar = () => {
    navigate('')
  }

  return (
    <div>
      {/* 로그인한 유저의 역할이 Admin인 경우 */}
      {role === 'Admin' && (
        <div className="m-5">
          <div className="text-md mb-5 font-bold">HOME</div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 bg-white shadow-md">
              <div className="m-3">My Profile</div>
              <div className="flex items-center justify-center">
                {!profile?.profileImgUrl ? (
                  <UserCircleIcon className="h-auto w-44 text-gray-500" />
                ) : (
                  <img src={profile.profileImgUrl} alt={profile.name} />
                )}
              </div>
              <div className="mb-3 flex items-center justify-center">
                <div>{profile?.name}</div>
              </div>
              <div className="mb-5 flex items-center justify-center">
                <div className="text-xs">{profile?.role}</div>
              </div>
            </div>
            <div className="col-span-2 bg-white shadow-md">
              <div className="m-3">Coming schedule</div>
            </div>
            <div
              className="col-span-1 cursor-pointer bg-white p-5 shadow-md"
              onClick={goToAdminHuddle}
            >
              <div className="flex items-center justify-center">
                <ArrowTrendingUpIcon className="h-auto w-28 text-blue-900" />
              </div>
              <div className="mb-3 flex items-center justify-center">
                <div>Huddle</div>
              </div>
              <div className="mb-5 flex items-center justify-center">
                <div className="text-xs">Huddle 페이지로 이동합니다.</div>
              </div>
            </div>
            <div
              className="col-span-1 cursor-pointer bg-white p-5 shadow-md"
              onClick={goToAdminCalendar}
            >
              <div className="flex items-center justify-center">
                <CalendarIcon className="h-auto w-28 text-teal-600" />
              </div>
              <div className="mb-3 flex items-center justify-center">
                <div>캘린더</div>
              </div>
              <div className="mb-5 flex items-center justify-center">
                <div className="text-xs">캘린더 관리 페이지로 이동합니다.</div>
              </div>
            </div>
            <div
              className="col-span-1 cursor-pointer bg-white p-5 shadow-md"
              onClick={goToAdminNotice}
            >
              <div className="flex items-center justify-center">
                <DocumentCheckIcon className="h-auto w-28 text-red-700" />
              </div>
              <div className="mb-3 flex items-center justify-center">
                <div>Notice</div>
              </div>
              <div className="mb-5 flex items-center justify-center">
                <div className="text-xs">Notice 관리 페이지로 이동합니다.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsoleHome
