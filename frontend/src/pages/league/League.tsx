// LeagueList.tsx
import Button from '@/components/buttons/Button'
import { useNavigate } from 'react-router-dom'

const leagueList = [
  {
    id: 1,
    logo: '/logo/KAFA_OG.png',
    assosiation: '사회인연맹',
    leagueName: '제 00회 타이거볼',
    period: '10/01 ~ 12/02',
    isFinished: false
  },
  {
    id: 2,
    logo: '/logo/KAFA_OG.png',
    assosiation: '사회인연맹',
    leagueName: '제 00회 타이거볼',
    period: '10/01 ~ 12/02',
    isFinished: false
  },
  {
    id: 3,
    logo: '/logo/KAFA_OG.png',
    assosiation: '사회인연맹',
    leagueName: '제 00회 타이거볼',
    period: '10/01 ~ 12/02',
    isFinished: true
  },
  {
    id: 4,
    logo: '/logo/KAFA_OG.png',
    assosiation: '사회인연맹',
    leagueName: '제 00회 타이거볼',
    period: '10/01 ~ 12/02',
    isFinished: false
  },
  {
    id: 5,
    logo: '/logo/KAFA_OG.png',
    assosiation: '사회인연맹',
    leagueName: '제 00회 타이거볼',
    period: '10/01 ~ 12/02',
    isFinished: false
  }
]

const League = () => {
  const navigate = useNavigate()

  const goToRegister = () => {
    console.log('출전등록 페이지로 이동')
  }

  const goToLeagueDetail = (id: number) => {
    navigate(`/league/${id}`)
    console.log(`리그 상세페이지로 이동: ${id}`)
  }

  return (
    <div className=" pt-16">
      <div className="bg-indigo-800 p-6 text-xl text-white">Leagues</div>
      <div className="mb-5">
        {leagueList.map((league) => (
          <div
            key={league.id}
            className={`mx-5 my-5 flex justify-between rounded-md ${
              league.isFinished ? 'bg-gray-500' : 'bg-gray-800'
            } p-7 lg:p-10`}
          >
            <div className="flex text-white">
              <img
                src={league.logo}
                alt="KAFA Logo"
                className="h-40 w-20 lg:w-32"
              />
              <div className="ml-3 flex flex-col justify-center gap-4 lg:ml-10">
                <div className="text-gray-250 text-xl font-semibold">
                  {league.assosiation}
                </div>
                <div
                  className={`text-lg font-bold lg:text-2xl ${
                    league.isFinished ? 'text-white-900' : ''
                  }`}
                >
                  {league.leagueName}
                  {league.isFinished && ' (종료됨)'}
                </div>
                <div className="text-lg">{league.period}</div>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4">
              {!league.isFinished && (
                <div>
                  <Button
                    variant="outlineWhiteText"
                    label="출전등록"
                    onClick={goToRegister}
                  />
                </div>
              )}
              <div>
                <Button
                  variant="outlineWhiteText"
                  label="바로가기"
                  onClick={() => goToLeagueDetail(league.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default League
