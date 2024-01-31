import axiosInstance from '@/commons/axios'
import { Role, type Profile } from '@/commons/interfaces/account/profile'
import { userState } from '@/state/userState'
import { UserCircleIcon } from '@heroicons/react/20/solid'
import {
  TrophyIcon,
  PlayIcon,
  PencilSquareIcon
} from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import ManagerHome from './manager/ManagerHome'
import UserHome from './user/UserHome'

const ConsoleHome = () => {
  const user = useRecoilValue(userState)
  const [profile, setProfile] = useState<Profile>()
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

  const goToAdminRecode = () => {
    navigate('/console/create-recode')
  }

  const goToAdminLeague = () => {
    navigate('/console/manage-league')
  }

  const goToAdminGame = () => {
    navigate('/console/manage-game')
  }

  const goToProfile = () => {
    navigate('/console/profile')
  }

  return (
    <div>
      {/* Admin Console */}
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
              onClick={goToAdminLeague}
            >
              <div className="flex items-center justify-center">
                <TrophyIcon className="h-auto w-28 text-blue-900" />
              </div>
              <div className="mb-3 flex items-center justify-center">
                <div>리그 관리</div>
              </div>
              <div className="mb-5 flex items-center justify-center">
                <div className="text-xs">리그 관리 페이지로 이동합니다.</div>
              </div>
            </div>
            <div
              className="col-span-1 cursor-pointer bg-white p-5 shadow-md"
              onClick={goToAdminGame}
            >
              <div className="flex items-center justify-center">
                <PlayIcon className="h-auto w-28 text-teal-600" />
              </div>
              <div className="mb-3 flex items-center justify-center">
                <div>경기 관리</div>
              </div>
              <div className="mb-5 flex items-center justify-center">
                <div className="text-xs">경기 관리 페이지로 이동합니다.</div>
              </div>
            </div>
            <div
              className="col-span-1 cursor-pointer bg-white p-5 shadow-md"
              onClick={goToAdminRecode}
            >
              <div className="flex items-center justify-center">
                <PencilSquareIcon className="h-auto w-28 text-red-700" />
              </div>
              <div className="mb-3 flex items-center justify-center">
                <div>기록 관리</div>
              </div>
              <div className="mb-5 flex items-center justify-center">
                <div className="text-xs">기록 관리 페이지로 이동합니다.</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Normal Console */}
      {user.role === Role.User && profile ? (
        <UserHome profile={profile} />
      ) : null}
      {/* Manager Console */}
      {user.role === Role.Manager && profile ? (
        <ManagerHome profile={profile} />
      ) : null}
    </div>
  )
}

export default ConsoleHome
