// TeamCard.tsx
import PropTypes from 'prop-types'
import type React from 'react'
import Button from '../buttons/Button'

interface TeamCardProps {
  id: number
  teamLogo: string
  teamName: string
  nickName: string
  teamColor: string
  createdAt: string
  isWhite?: (teamColor: string) => boolean
  onClick?: (id: number) => void
}

const TeamCard: React.FC<TeamCardProps> = ({
  id,
  teamLogo,
  teamName,
  nickName,
  teamColor,
  createdAt,
  isWhite = () => true,
  onClick
}) => {
  return (
    <div
      className={`flex flex-col rounded-lg font-sans text-white drop-shadow-xl sm:flex-row ${teamColor}`}
      style={{ backgroundColor: teamColor, width: '500px', height: '200px' }} // 너비 설정
      onClick={() => onClick?.(id)}
    >
      <div className="relative flex flex-col items-center justify-center px-10">
        <img
          className="mx-5 my-5 h-20"
          src={teamLogo}
          alt={`${teamName} Logo`}
        />
      </div>
      <div className="flex flex-auto flex-col items-center justify-center p-5 text-black">
        <div className="mb-1 text-lg font-extrabold">{teamName}</div>
        <div className="text-m mb-3 font-normal">{nickName}</div>
        <Button
          variant="outlineWithLightHover"
          label="팀 페이지"
          onClick={() => onClick?.(id)}
        />
        <p className={`mt-3 text-sm ${isWhite(teamColor) ? 'text-black' : ''}`}>
          since {new Date(createdAt).getFullYear()}
        </p>
      </div>
    </div>
  )
}

TeamCard.propTypes = {
  id: PropTypes.number.isRequired,
  teamLogo: PropTypes.string.isRequired,
  teamName: PropTypes.string.isRequired,
  teamColor: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  isWhite: PropTypes.func,
  onClick: PropTypes.func
}

export default TeamCard
