import axiosInstance from '@/commons/axios'
import { Role, type Profile } from '@/commons/interfaces/account/profile'
import { userState } from '@/state/userState'
import { UserCircleIcon } from '@heroicons/react/20/solid'
import { ArrowTrendingUpIcon } from '@heroicons/react/20/solid'
import { CalendarIcon } from '@heroicons/react/20/solid'
import { DocumentCheckIcon } from '@heroicons/react/20/solid'
import { DocumentTextIcon } from '@heroicons/react/20/solid'
import { UserGroupIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

const ConsoleHome = () => {
  const user = useRecoilValue(userState)
  const [profile, setProfile] = useState<Profile | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axiosInstance.get('/account/profile')
        setProfile(response.data)
      } catch (error) {
        console.error(error)
      }
    }
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

  const goToLoadRoster = () => {
    navigate('/console/loadRoster')
  }

  const goToManagerEnroll = () => {
    navigate('/console/enroll')
  }

  const goToManageRoster = () => {
    navigate('/console/manageRoster')
  }

  const goToProfile = () => {
    navigate('/console/profile')
  }

  return (
    <div>
      {/* 로그인한 유저의 역할이 Admin인 경우 */}
      {user.role === Role.Admin && (
        <div className="m-5">
          <div className="text-md mb-5 font-bold">HOME</div>
          <div className="grid grid-cols-3 gap-4">
            <div
              className="col-span-1 cursor-pointer bg-white shadow-md"
              onClick={goToProfile}
            >
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
      {user.role === Role.User && (
        <div className="m-5">
          <div className="text-md mb-5 font-bold">HOME</div>
          <div className="grid grid-cols-3 gap-4">
            <div
              className="col-span-1 cursor-pointer bg-white shadow-md"
              onClick={goToProfile}
            >
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
                <div className="text-xs">프로필 페이지로 이동합니다.</div>
              </div>
            </div>
            <div className="col-span-1 cursor-pointer bg-white shadow-md">
              <div className="mt-12 flex items-center justify-center">
                <DocumentTextIcon className="h-auto w-44 text-blue-950" />
              </div>
              <div className="mb-3 flex items-center justify-center">
                <div>자료 제출</div>
              </div>
              <div className="mb-5 flex items-center justify-center">
                <div className="text-xs">자료 제출 페이지로 이동합니다.</div>
              </div>
            </div>
            <div
              className="col-span-1 cursor-pointer bg-white shadow-md"
              onClick={goToLoadRoster}
            >
              <div className="mt-12 flex items-center justify-center">
                <DocumentCheckIcon className="h-auto w-44 text-red-700" />
              </div>
              <div className="mb-3 flex items-center justify-center">
                <div>로스터 불러오기</div>
              </div>
              <div className="mb-5 flex items-center justify-center">
                <div className="text-xs">
                  로스터 불러오기 페이지로 이동합니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {user.role === Role.Manager && (
        <div className="m-5">
          <div className="text-md mb-5 font-bold">HOME</div>
          <div className="grid grid-cols-3 gap-4">
            <div
              className="col-span-1 bg-white shadow-md"
              onClick={goToProfile}
            >
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
                <div className="text-xs">프로필 페이지로 이동합니다.</div>
              </div>
            </div>
            <div
              className="col-span-1 bg-white shadow-md"
              onClick={goToManageRoster}
            >
              <div className="mt-12 flex items-center justify-center">
                <UserGroupIcon className="h-auto w-44 text-blue-950" />
              </div>
              <div className="mb-3 flex items-center justify-center">
                <div>로스터 관리</div>
              </div>
              <div className="mb-5 flex items-center justify-center">
                <div className="text-xs">로스터 관리 페이지로 이동합니다.</div>
              </div>
            </div>
            <div
              className="col-span-1 bg-white shadow-md"
              onClick={goToManagerEnroll}
            >
              <div className="mt-12 flex items-center justify-center">
                <DocumentCheckIcon className="h-auto w-44 text-red-700" />
              </div>
              <div className="mb-3 flex items-center justify-center">
                <div>참가 신청</div>
              </div>
              <div className="mb-5 flex items-center justify-center">
                <div className="text-xs">참가 신청 페이지로 이동합니다.</div>
              </div>
            </div>
            <div className="col-span-3 bg-white shadow-md">
              <div className="m-3 ml-5 flex items-center justify-start">
                <div>Notice</div>
              </div>
              <div className="mb-5 ml-5 flex items-center justify-start">
                <div className="pb-44 text-xs">협회 알림 내용</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsoleHome
