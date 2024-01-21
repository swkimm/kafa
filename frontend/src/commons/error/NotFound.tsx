import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <main className="grid h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-xl font-semibold text-yellow-400">ERROR</p>
          <div className="mt-3 flex items-center justify-center">
            <ExclamationTriangleIcon className="-ml-0.5 mr-1.5 mt-0.5 h-6 w-6 text-yellow-400 sm:mt-1 sm:h-8 sm:w-8" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Not Found
            </h1>
          </div>
          <p className="mt-6 text-sm text-gray-600 sm:text-base">
            존재하지 않는 페이지입니다
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={() => navigate('/')}
              className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

export default NotFound
