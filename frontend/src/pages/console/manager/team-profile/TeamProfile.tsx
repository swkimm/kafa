import ConsoleCard from '@/components/cards/ConsoleCard'
import TeamProfileCard from './ProfileCard'

const ManageTeamProfile: React.FC = () => {
  return (
    <div className="m-0 h-full w-full sm:p-5">
      <div className="text-md mb-5 px-4 pt-5 font-bold sm:px-0 sm:pt-0">
        팀 정보 수정
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3">
          <ConsoleCard title="팀 프로필" subtitle="팀 프로필 정보를 수정합니다">
            <TeamProfileCard />
          </ConsoleCard>
        </div>
      </div>
    </div>
  )
}

export default ManageTeamProfile
