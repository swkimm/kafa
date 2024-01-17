import { printRole } from '@/commons/functions/role/role.print'
import type { Profile } from '@/commons/interfaces/account/profile'

interface ProfileCardProps {
  profile: Profile
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <div className="rounded-lg border border-gray-200/60 bg-gray-100 p-5">
      <div className="mb-3">
        <div className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-50 sm:h-10 sm:w-10">
          {profile.profileImgUrl ? (
            <img className="h-full w-full" src={profile.profileImgUrl} />
          ) : (
            <svg
              className="h-full w-full
              text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <p className="text-sm text-gray-900">이름</p>
        <p className="text-sm font-medium">{profile.name}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm text-gray-900">이메일</p>
        <p className="text-sm font-medium">{profile.email}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm text-gray-900">권한</p>
        <p className="text-sm font-medium">{printRole(profile.role)}</p>
      </div>
    </div>
  )
}

export default ProfileCard
