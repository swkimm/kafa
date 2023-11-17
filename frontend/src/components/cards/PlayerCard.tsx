import type React from 'react'

interface PlayerCardProps {
  id: number
  name: string
  profileImgUrl: string | null
  backNumber: number
  position: string[] // Assuming position is an array of strings
  onClick: (id: number) => void // Function to handle click events
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  id,
  name,
  profileImgUrl,
  backNumber,
  position,
  onClick
}) => {
  const profileImage =
    profileImgUrl || 'https://cdn.playprove.one/default/people_alt.webp'
  const positionText =
    position && position.length > 0 ? position.join('/') : 'N/A'

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
          <p className="text-lg font-medium text-gray-900">{backNumber}</p>
        </div>
        <p className="text-sm font-normal text-gray-500">{positionText}</p>
      </div>
    </div>
  )
}

export default PlayerCard
