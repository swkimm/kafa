interface MemberBannerProps {
  teamLogo: string
  teamName: string
  name: string
  profile: string
  height: number
  weight: number
  backNumber: number
  position: string
}

const MemberBanner: React.FC<MemberBannerProps> = ({
  teamLogo,
  teamName,
  name,
  profile,
  height,
  weight,
  backNumber,
  position
}) => {
  return (
    <div className="w-full bg-black text-white">
      <div className="grid grid-cols-6">
        <div className="my-auto hidden sm:block">
          <img src={teamLogo} alt="" className="ml-20 h-56 w-auto" />
        </div>
        <div className="col-span-2 ml-5 py-5 sm:my-auto sm:ml-10 sm:py-20">
          <div className="mb-5 flex items-center justify-start">
            <div>
              <div className="text-sm text-gray-400">소속팀</div>
              <div className="">{teamName}</div>
            </div>
          </div>
          <div className="mb-5 flex items-center justify-start">
            <div className="mr-12 hidden sm:block">
              <div className="text-sm text-gray-400">키(cm)</div>
              <div>{height}</div>
            </div>
            <div className="mr-12 hidden sm:block">
              <div className="text-sm text-gray-400">몸무게(kg)</div>
              <div>{weight}</div>
            </div>
          </div>
          <div className="flex items-center justify-start">
            <div className="mr-12 hidden sm:block">
              <div className="text-sm text-gray-400">백넘버</div>
              <div>{backNumber}</div>
            </div>
            <div className="mr-12 hidden sm:block">
              <div className="text-sm text-gray-400">포지션</div>
              <div>{position}</div>
            </div>
          </div>
        </div>
        <div className="flex items-end justify-end">
          <div className="">
            <div className="text-sm text-gray-400">이름</div>
            <div className="text-lg">{name}</div>
          </div>
        </div>
        <div className="col-span-3 flex items-end justify-end sm:col-span-2 sm:justify-center">
          <img src={profile} alt="" className="w-50 h-60 sm:h-full sm:w-72" />
        </div>
      </div>
    </div>
  )
}

export default MemberBanner
