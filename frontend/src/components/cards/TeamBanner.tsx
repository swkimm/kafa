// TeamBanner.tsx
import type { TeamComplication } from '@/commons/interfaces/team/teamComplication'
import type React from 'react'

const isColorLight = (hexColor: string): boolean => {
  hexColor = hexColor.replace('#', '').toUpperCase()

  const r = parseInt(hexColor.substring(0, 2), 16)
  const g = parseInt(hexColor.substring(2, 4), 16)
  const b = parseInt(hexColor.substring(4, 6), 16)

  const brightness = 0.299 * r + 0.587 * g + 0.114 * b
  const lightColorThreshold = 180

  return brightness > lightColorThreshold
}

const TeamBanner: React.FC<TeamComplication> = ({
  name,
  globalName,
  hometown,
  establishedAt,
  color,
  profileImgUrl
}) => {
  const getYear = (date: Date) => new Date(date).getFullYear().toString()

  return (
    <div style={{ backgroundColor: color || '#173921' }}>
      <div className="mx-auto max-w-screen-xl px-4 text-white lg:px-20">
        <div className="mb-3 flex flex-row pt-8">
          <div
            className={`basis-1/3 ${isColorLight(color) ? 'text-black' : 'text-white'}`}
          >
            <h1 className="px-4 text-xs sm:px-0 sm:text-xs">{name}</h1>
            <h1 className="px-4 text-sm font-bold sm:px-0 sm:text-lg">
              {globalName}
            </h1>
          </div>
          <div className="basis-1/3 px-4">
            <img
              src={profileImgUrl || '/logo/KAFA_OG.png'}
              alt={name}
              className="mx-auto hidden h-auto object-contain text-black sm:hidden lg:block lg:w-56"
              onError={(e) => (e.currentTarget.src = '/logo/KAFA_OG.png')}
            />
          </div>
          <div className="basis-1/3">
            <img
              src={profileImgUrl || '/logo/KAFA_OG.png'}
              alt={globalName}
              className="mx-auto h-auto w-28 items-center object-contain lg:hidden"
            />
          </div>
        </div>
        <div className="mb-3 flex flex-col px-4 pb-4 pt-4 sm:flex-row">
          <div
            className={`flex basis-1/3 flex-col border-0 sm:flex-col sm:items-start md:items-center md:border-r lg:items-center lg:border-r xl:items-center xl:border-r ${
              isColorLight(color) ? 'text-black' : 'text-white'
            }`}
          >
            <div className="mb-2 text-xs">소속(연고지)</div>
            <div className="font-bold sm:text-lg lg:text-2xl">{hometown}</div>
          </div>
          <hr className="my-3 border-b-0" />
          <div
            className={`sm-border-b flex basis-1/3 flex-col sm:flex-col sm:items-start md:items-center md:border-r lg:items-center lg:border-r xl:items-center xl:border-r ${
              isColorLight(color) ? 'text-black' : 'text-white'
            }`}
          >
            <div className="mb-2 text-xs">이름</div>
            <div className="font-bold sm:text-lg lg:text-2xl">{globalName}</div>
          </div>
          <hr className="my-3 border-b-0" />
          <div
            className={`flex basis-1/3 flex-col border-0 sm:flex-col sm:items-start md:items-center lg:items-center lg:border-0 xl:items-center xl:border-0 ${
              isColorLight(color) ? 'text-black' : 'text-white'
            }`}
          >
            <div className="mb-2 text-xs">설립연도</div>
            <div className="font-bold sm:text-lg lg:text-2xl">
              {getYear(establishedAt)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center bg-gray-900 py-3">
        <div className="flex flex-row">
          <a href="#" className="">
            <i
              className="fa-brands fa-instagram fa-xl mx-1 align-middle"
              style={{ color: '#ffffff' }}
            ></i>
          </a>
          <div className="align-middle text-sm text-white">@instagram</div>
        </div>
      </div>
    </div>
  )
}

export default TeamBanner
