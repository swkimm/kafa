// TeamBanner.tsx
import type React from 'react'

interface TeamBannerProps {
  id: number // 팀 식별자
  name: string // 팀 이름
  globalName: string // 팀 영문 이름
  hometown: string // 팀 연고지
  initial: string // 팀 이니셜
  establisehdAt: Date // 팀 설립연도
  color: string // 팀 메인컬러
  subColor?: string // 팀 서브컬러 (선택 사항)
  profileImgUrl?: string // 팀 프로필 이미지 주소 (선택 사항)
  backgroundImgUrl?: string // 팀 배경 이미지 주소 (선택 사항)
  deletedAt?: Date // 팀 삭제 날짜 (선택 사항)
  status: string // 팀 상태
  createdAt: Date // 팀 객체 등록 날짜
  isWhite?: (teamColor: string) => boolean
}

const TeamBanner: React.FC<TeamBannerProps> = ({
  name,
  globalName,
  hometown,
  initial,
  establisehdAt,
  color,
  profileImgUrl,
  isWhite = () => false
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
              src={profileImgUrl}
              alt={name}
              className="m-auto hidden items-center text-center sm:hidden lg:block lg:h-64 lg:w-64"
              onError={(e) => (e.currentTarget.src = '/path_to_default_image')}
            />
          </div>
          <div className="basis-1/3">
            <img
              src={profileImgUrl}
              alt={globalName}
              className="block items-center sm:block sm:h-32 sm:w-32 md:block md:h-32 md:w-32 lg:hidden"
            />
          </div>
        </div>
        <div className="mb-3 flex flex-col px-4 pb-4 pt-4 sm:flex-row">
          <div
            className={`flex basis-1/3 flex-col border-0 sm:flex-col sm:items-start md:items-center md:border-r lg:items-center lg:border-r xl:items-center xl:border-r ${
              isWhiteText ? 'text-black' : ''
            }`}
          >
            <div className="mb-2 text-xs">Hometown</div>
            <div className="font-bold sm:text-lg lg:text-2xl">{hometown}</div>
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
              {getYear(establisehdAt)}
            </div>
          </div>
        </div>
        <div
          className="flex flex-row justify-center py-3"
          style={{ backgroundColor: darkenColor(color, 100) }} // `darkenColor` 함수 구현 필요
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
    </div>
  )
}

export default TeamBanner
