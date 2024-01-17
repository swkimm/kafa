import axiosInstance from '@/commons/axios'
import type { CertificationStatus } from '@/commons/interfaces/account/certification'
import type { Profile } from '@/commons/interfaces/account/profile'
import type { RosterWithTeam } from '@/commons/interfaces/roster/rosterWithTeam'
import ConsoleCard from '@/components/cards/ConsoleCard'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountCertificationStatus from './AccountCertificationStatus'
import ProfileCard from './ProfileCard'
import RosterList from './RosterList'

interface UserHomeProps {
  profile: Profile
}

const UserHome: React.FC<UserHomeProps> = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile>()
  const [certificationStatus, setCertificationStatus] =
    useState<CertificationStatus>()
  const [rosters, setRosters] = useState<RosterWithTeam[]>([])

  const goToProfile = () => navigate('/console/profile')
  const goToLoadRoster = () => navigate('/console/loadRoster')

  useEffect(() => {
    const getProfile = async () => {
      const profile: Profile = await axiosInstance
        .get('/account/profile')
        .then((result) => result.data)

      setProfile(profile)
    }

    const getCertificationStatus = async () => {
      const certificationStatus: CertificationStatus = await axiosInstance
        .get('/account/status')
        .then((result) => result.data)

      setCertificationStatus(certificationStatus)
    }

    const getRosters = async () => {
      const rosters: RosterWithTeam[] = await axiosInstance
        .get('/rosters/account')
        .then((result) => result.data)

      setRosters(rosters)
    }

    getProfile()
    getCertificationStatus()
    getRosters()
  }, [])

  return (
    <div className="m-0 h-full w-full sm:p-5">
      <div className="text-md mb-5 px-4 pt-5 font-bold sm:px-0 sm:pt-0">
        HOME
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 lg:col-span-1">
          <ConsoleCard
            title="Profile"
            subtitle="계정 프로필"
            more={goToProfile}
          >
            {profile ? <ProfileCard profile={profile} /> : null}
          </ConsoleCard>
        </div>
        <div className="col-span-3 lg:col-span-2">
          <ConsoleCard
            title="Authentication"
            subtitle="계정인증 정보 요약"
            more={goToLoadRoster}
          >
            {certificationStatus ? (
              <AccountCertificationStatus status={certificationStatus} />
            ) : null}
          </ConsoleCard>
        </div>
        <div className="col-span-3">
          <ConsoleCard
            title="Roster"
            subtitle="현재 계정에 연결된 로스터 목록"
            more={goToLoadRoster}
          >
            {rosters ? <RosterList rosters={rosters} /> : null}
          </ConsoleCard>
        </div>
      </div>
    </div>
  )
}

export default UserHome
