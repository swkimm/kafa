import type { TeamSimple } from '@/commons/interfaces/team/teamSimple'
import Button from '../buttons/Button'

const isColorLight = (hexColor: string): boolean => {
  hexColor = hexColor.replace('#', '').toUpperCase()

  const r = parseInt(hexColor.substring(0, 2), 16)
  const g = parseInt(hexColor.substring(2, 4), 16)
  const b = parseInt(hexColor.substring(4, 6), 16)

  const brightness = 0.299 * r + 0.587 * g + 0.114 * b
  const lightColorThreshold = 180

  return brightness > lightColorThreshold
}

const TeamCard: React.FC<TeamSimple> = ({
  id,
  name,
  globalName,
  color,
  hometown,
  profileImgUrl,
  onClick,
  establishedAt
}) => {
  return (
    <div
      className="flex h-full flex-row overflow-hidden rounded-lg bg-white text-white shadow-lg"
      style={{ backgroundColor: color }}
    >
      <div className="relative isolate flex h-full flex-shrink-0 flex-col items-center justify-center px-10 sm:px-16 sm:py-5">
        <img
          className="mt-0 h-auto max-h-36 w-[100px] object-contain sm:w-[160px]"
          src={profileImgUrl}
          alt={`${globalName} Logo`}
        />
      </div>
      <div className="flex-auto flex-col p-5 text-black">
        <div className="flex flex-wrap">
          <div
            className={
              'flex-1 text-base font-bold sm:text-lg ' +
              (isColorLight(color) ? 'text-black' : 'text-white')
            }
          >
            {name}
          </div>
          <div
            className={
              'mt-0.5 w-full flex-none text-sm font-bold sm:mt-2 ' +
              (isColorLight(color) ? 'text-gray-500' : 'text-gray-300')
            }
          >
            {hometown}
          </div>
        </div>
        <div className="my-2.5 flex text-sm font-bold sm:my-6">
          <div className="mx-auto">
            <Button
              variant="outlineWithLightHover"
              label="팀 페이지"
              onClick={() => onClick?.(id)}
            />
          </div>
        </div>
        <div
          className={
            'text-xs font-light ' +
            (isColorLight(color) ? 'text-black' : 'text-white')
          }
        >
          <p>Since {establishedAt?.substring(0, 4)}</p>
        </div>
      </div>
    </div>
  )
}

export default TeamCard
