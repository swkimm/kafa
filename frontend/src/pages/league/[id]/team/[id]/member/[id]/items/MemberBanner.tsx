import PropTypes from 'prop-types'

interface MemberBannerProps {
  teamLogo: string
  teamName: string
  name: string
  profile: string
  age: number
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
  age,
  height,
  weight,
  backNumber,
  position
}) => {
  return (
    <div className="w-full bg-black text-white">
      <div className="grid grid-cols-6">
        <div className="my-auto">
          <img src={teamLogo} alt="" className="ml-20 h-56 w-auto" />
        </div>
        <div className="col-span-2 my-auto ml-10 py-20">
          <div className="mb-5 flex items-center justify-start">
            <div>
              <div className="text-sm text-gray-400">소속팀</div>
              <div>{teamName}</div>
            </div>
          </div>
          <div className="mb-5 flex items-center justify-start">
            <div className="mr-12">
              <div className="text-sm text-gray-400">나이</div>
              <div>{age}</div>
            </div>
            <div className="mr-12">
              <div className="text-sm text-gray-400">키(cm)</div>
              <div>{height}</div>
            </div>
            <div className="mr-12">
              <div className="text-sm text-gray-400">몸무게(kg)</div>
              <div>{weight}</div>
            </div>
          </div>
          <div className="flex items-center justify-start">
            <div className="mr-10">
              <div className="text-sm text-gray-400">백넘버</div>
              <div>{backNumber}</div>
            </div>
            <div className="mr-10">
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
        <div className="col-span-2 flex items-end">
          <img src={profile} alt="" className="h-full w-72" />
        </div>
      </div>
    </div>
  )
}

MemberBanner.propTypes = {
  teamLogo: PropTypes.string.isRequired,
  teamName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  profile: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  weight: PropTypes.number.isRequired,
  backNumber: PropTypes.number.isRequired,
  position: PropTypes.string.isRequired
}

export default MemberBanner
