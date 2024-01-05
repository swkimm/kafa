import type { Roster } from '@/commons/interfaces/roster/roster'
import type React from 'react'

interface PlayerCardProps {
  playerData: Roster
  onClick: (id: number) => void
}

const PlayerCard: React.FC<PlayerCardProps> = ({ playerData, onClick }) => {
  if (!playerData) {
    return null
  }
  const { id, name, profileImgUrl, Athlete } = playerData
  const profileImage =
    profileImgUrl || 'https://cdn.playprove.one/default/people_alt.webp'

  // Convert the athlete's position object to a string
  const positionText =
    Athlete && Athlete.position
      ? [
          Athlete.position.offence ? `${Athlete.position.offence}` : '',
          Athlete.position.defense ? `${Athlete.position.defense}` : '',
          Athlete.position.special ? `${Athlete.position.special}` : ''
        ]
          .filter(Boolean)
          .join(' / ')
      : 'N/A'

  return (
    <div className="group relative">
      <div className="p-4 sm:px-16">
        <div className="lg:aspect-none w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-80 lg:h-80">
          <img
            src={profileImage}
            alt={name}
            className="h-full w-full object-cover object-center"
            onClick={() => onClick(id)}
          />
        </div>
      </div>
      <div className="p-4 sm:px-16">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">{name}</h3>
          {Athlete && (
            <p className="text-lg font-medium text-gray-900">
              {Athlete.backNumber}
            </p>
          )}
        </div>
        <p className="text-sm font-normal text-gray-500">{positionText}</p>
      </div>
    </div>
  )
}

export default PlayerCard
