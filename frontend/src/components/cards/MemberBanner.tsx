interface MemberBannerProps {
  teamLogo: string
  teamName: string
  name: string
  profile: string
  height: number
  weight: number
  backNumber: number
  position: string
  registerYear: string
}

const MemberBanner: React.FC<MemberBannerProps> = ({
  teamLogo,
  teamName,
  name,
  profile,
  height,
  weight,
  backNumber,
  position,
  registerYear
}) => {
  return (
    <div className="w-full bg-gray-900 pt-5 text-white">
      <div className="lg-px:20 mx-auto max-w-screen-xl px-4">
        <div className="grid grid-cols-6">
          <div className="my-auto hidden sm:block">
            <img
              src={teamLogo}
              alt=""
              className="ml-20 h-auto w-32 object-contain"
            />
          </div>
          <div className="col-span-4 py-5 sm:col-span-2 sm:my-auto sm:ml-10 sm:py-20">
            <div className="mb-5 flex items-center justify-start gap-x-3">
              <div className="block sm:hidden">
                <div className="text-xs text-gray-400 sm:text-sm">이름</div>
                <div>{name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 sm:text-sm">소속팀</div>
                <div>{teamName}</div>
              </div>
            </div>
            <div className="mb-5 flex items-center justify-start gap-x-3">
              <div className="sm:mr-12">
                <div className="text-xs text-gray-400 sm:text-sm">키(cm)</div>
                <div>{height}</div>
              </div>
              <div className="sm:mr-12">
                <div className="text-xs text-gray-400 sm:text-sm">
                  몸무게(kg)
                </div>
                <div>{weight}</div>
              </div>
            </div>
            <div className="flex items-center justify-start gap-x-3">
              <div className="sm:mr-12">
                <div className="text-xs text-gray-400 sm:text-sm">백넘버</div>
                <div>{backNumber}</div>
              </div>
              <div className="sm:mr-12">
                <div className="text-xs text-gray-400 sm:text-sm">포지션</div>
                <div>{position}</div>
              </div>
              <div className="sm:mr-12">
                <div className="text-xs text-gray-400 sm:text-sm">입부년도</div>
                <div>{registerYear}</div>
              </div>
            </div>
          </div>
          <div className="col-span-2 flex items-end justify-end sm:col-span-3">
            <div className="hidden items-end justify-end sm:flex">
              <div>
                <div className="text-sm text-gray-400">이름</div>
                <div className="text-lg">{name}</div>
              </div>
            </div>
            <img
              src={profile}
              alt=""
              className="h-auto w-24 object-contain sm:w-72"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberBanner
