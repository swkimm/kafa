import ChangePasswordCard from './ChangePasswordCard'
import CurrentProfileCard from './CurrentProfileCard'

const MyProfile = () => {
  return (
    <>
      <div className="m-0 h-full w-full sm:p-5">
        <div className="px-4 pt-5 sm:px-0 sm:pt-0">
          <h1 className="text-md mb-5 font-bold">계정 관리</h1>
        </div>
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-5 sm:col-span-2">
            <CurrentProfileCard />
          </div>
          <div className="col-span-5 sm:col-span-3">
            <ChangePasswordCard />
          </div>
        </div>
      </div>
    </>
  )
}

export default MyProfile
