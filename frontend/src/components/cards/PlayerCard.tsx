import type React from 'react'

interface PlayerCardProps {
  id: number
  profile: string
  name: string
  backNumber: number
  offPosition: string
  defPosition: string
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  profile,
  name,
  backNumber,
  offPosition,
  defPosition
}) => {
  const profileImage =
    profile || 'https://cdn.playprove.one/default/people_alt.webp'
  const positionText = `${offPosition}/${defPosition}`

  return (
    <div style={{ width: '250px', height: '500px' }}>
      <div className="h-2/3 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-80">
        <img
          src={profileImage}
          alt={name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="h-15 flex w-full flex-col justify-center rounded-b-md bg-gray-50">
        <div className="flex justify-between text-sm font-semibold text-gray-700">
          <div className="text-xl">{name}</div>
          <div className="text-lg">{backNumber}</div>
        </div>
        <p className="mb-2 mt-2 text-xs font-normal text-gray-500">
          {positionText}
        </p>
      </div>
    </div>
  )
}

export default PlayerCard
