import RecentLeagueSection from './RecentLeagueSection'
import RecentNoticeSection from './RecentNoticeSection'
import RecentPostSection from './RecentPost'
import RecentlyEndedGameSection from './RecentlyEndedGameSection'
import UpcommingGameSection from './UpcommingGameSection'

const HomeItem = () => {
  return (
    <div className="mb-10 mt-5 w-full">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2 lg:gap-y-8 lg:px-20">
        <div className="col-span-1">
          <RecentlyEndedGameSection />
        </div>
        <div className="col-span-1">
          <UpcommingGameSection />
        </div>
        <div className="col-span-1 w-full lg:col-span-2">
          <RecentLeagueSection />
        </div>
        <div className="col-span-1">
          <RecentNoticeSection />
        </div>
        <div className="col-span-1">
          <RecentPostSection />
        </div>
      </div>
    </div>
  )
}

export default HomeItem
