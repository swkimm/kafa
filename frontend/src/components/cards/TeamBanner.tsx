// TeamBanner.tsx
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import type React from 'react'

const TeamBanner: React.FC<TeamComplication> = ({
  name,
  globalName,
  initial,
  establishedAt,
  color,
  profileImgUrl,
  isWhite = () => true
}) => {
  const getYear = (date: Date) => new Date(date).getFullYear().toString()
  const isWhiteText = isWhite(color)

  const darkenColor = (hex: string | undefined, percent: number) => {
    if (!hex) return ''

    hex = hex.replace(/^#/, '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)

    const darkerR = Math.round((r * (100 - percent)) / 100)
    const darkerG = Math.round((g * (100 - percent)) / 100)
    const darkerB = Math.round((b * (100 - percent)) / 100)

    const darkerHex = `#${darkerR.toString(16).padStart(2, '0')}${darkerG
      .toString(16)
      .padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`

    return darkerHex
  }

  return (
    <div style={{ backgroundColor: color || '#173921' }}>
      <div className="mx-auto max-w-screen-xl px-4 text-white sm:px-20">
        <div className="mb-3 flex flex-row pt-8">
          <div className={`basis-1/3 ${isWhiteText ? 'text-black' : ''}`}>
            <h1 className="px-4 text-xs sm:px-0 sm:text-xs">{name}</h1>
            <h1 className="px-4 text-xs sm:px-0 sm:text-xs">{globalName}</h1>
          </div>
          <div className="basis-1/3 px-4">
            <img
              src={profileImgUrl || '/logo/KAFA_OG.png'}
              alt={name}
              className="m-auto hidden items-center text-center text-black sm:hidden lg:block lg:h-64 lg:w-64"
              onError={(e) => (e.currentTarget.src = '/logo/KAFA_OG.png')}
            />
          </div>
          <div className="basis-1/3">
            <img
              src={profileImgUrl || '/logo/KAFA_OG.png'}
              alt={globalName}
              className="block items-center sm:block sm:h-24 sm:w-24 md:block md:h-32 md:w-32 lg:hidden"
            />
          </div>
        </div>
        <div className="mb-3 flex flex-col px-4 pb-4 pt-4 sm:flex-row">
          <div
            className={`flex basis-1/3 flex-col border-0 sm:flex-col sm:items-start md:items-center md:border-r lg:items-center lg:border-r xl:items-center xl:border-r ${
              isWhiteText ? 'text-black' : ''
            }`}
          >
            <div className="mb-2 text-xs">globalName</div>
            <div className="font-bold sm:text-lg lg:text-2xl">{globalName}</div>
          </div>
          <hr className="my-3 border-b-0" />
          <div
            className={`sm-border-b flex basis-1/3 flex-col sm:flex-col sm:items-start md:items-center md:border-r lg:items-center lg:border-r xl:items-center xl:border-r ${
              isWhiteText ? 'text-black' : ''
            }`}
          >
            <div className="mb-2 text-xs">Initial</div>
            <div className="font-bold sm:text-lg lg:text-2xl">{initial}</div>
          </div>
          <hr className="my-3 border-b-0" />
          <div
            className={`flex basis-1/3 flex-col border-0 sm:flex-col sm:items-start md:items-center lg:items-center lg:border-0 xl:items-center xl:border-0 ${
              isWhiteText ? 'text-black' : ''
            }`}
          >
            <div className="mb-2 text-xs">Established</div>
            <div className="font-bold sm:text-lg lg:text-2xl">
              {getYear(establishedAt)}
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex flex-row justify-center py-3"
        style={{ backgroundColor: darkenColor(color, 20) }} // `darkenColor` 함수 구현 필요
      >
        <div className="flex flex-row">
          <a href="#" className="">
            <i
              className="fa-brands fa-instagram fa-xl mx-1 align-middle"
              style={{ color: '#ffffff' }}
            ></i>
          </a>
          <div className="align-middle text-sm text-white">@insta</div>
        </div>
      </div>
    </div>
  )
}

export default TeamBanner
