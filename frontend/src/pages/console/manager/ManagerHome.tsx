import type { Profile } from '@/commons/interfaces/account/profile'
import ConsoleCard from '@/components/cards/ConsoleCard'
import { useNavigate } from 'react-router-dom'
import ProfileCard from '../user/ProfileCard'
import Shortcut from './Shortcut'

interface UserHomeProps {
  profile: Profile
}

const ManagerHome: React.FC<UserHomeProps> = ({ profile }) => {
  const navigate = useNavigate()
  return (
    <div className="m-0 h-full w-full sm:p-5">
      <div className="text-md mb-5 px-4 pt-5 font-bold sm:px-0 sm:pt-0">
        HOME
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 lg:col-span-1">
          <ConsoleCard
            title="프로필"
            subtitle="계정 프로필"
            more={() => navigate('/console/profile')}
          >
            {profile ? <ProfileCard profile={profile} /> : null}
          </ConsoleCard>
        </div>
        <div className="col-span-3 lg:col-span-2">
          <ConsoleCard title="바로가기" subtitle="주요 메뉴로 바로 이동">
            <Shortcut />
          </ConsoleCard>
        </div>
      </div>
    </div>
  )
}

export default ManagerHome
