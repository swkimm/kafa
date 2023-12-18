// TeamCard.tsx
import type { TeamSimple } from '@/commons/interfaces/teamSimple'
import PropTypes from 'prop-types'
import type React from 'react'
import Button from '../buttons/Button'

const TeamCard: React.FC<TeamSimple> = ({
  id,
  name,
  globalName,
  initial,
  color,
  profileImgUrl,
  isWhite = () => true,
  onClick
}) => {
  return (
    <div
      className={`flex rounded-lg font-sans text-white drop-shadow-xl sm:flex-row ${color}`}
      style={{ backgroundColor: color, width: '500px', height: '200px' }} // 너비 설정
      onClick={() => onClick?.(id)}
    >
      <div className="relative flex flex-col items-center justify-center px-10">
        <img
          className="mx-5 my-5 h-20"
          src={profileImgUrl}
          alt={`${globalName} Logo`}
        />
      </div>
      <div className="flex flex-auto flex-col items-center justify-center p-5 text-white">
        <div className={`mt-1 text-lg ${isWhite(color) ? 'text-black' : ''}`}>
          {name}
        </div>
        <div className={`mb-3 text-lg ${isWhite(color) ? 'text-black' : ''}`}>
          {initial}
        </div>
        <Button
          variant="outlineWithLightHover"
          label="팀 페이지"
          onClick={() => onClick?.(id)}
        />
        {/* <p className={`mt-3 text-sm ${isWhite(color) ? 'text-black' : ''}`}>
          since {new Date(createdAt).getFullYear()}
        </p> */}
      </div>
    </div>
  )
}

TeamCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  globalName: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  profileImgUrl: PropTypes.string.isRequired,
  isWhite: PropTypes.func,
  onClick: PropTypes.func
}

export default TeamCard
