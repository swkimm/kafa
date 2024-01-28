// Home.tsx
import { Disclosure } from '@headlessui/react'
import { useState, useEffect } from 'react'
import HomeItem from './items/home/HomeItem'
import ScheduleItem from './items/schedule/ScheduleItem'

const Home = () => {
  const [currentComponent, setCurrentComponent] = useState<string>('HOME')

  const [videoSource, setVideoSource] = useState(
    'https://cdn.playprove.one/landing/desktop.mp4'
  )

  useEffect(() => {
    const updateVideoSource = () => {
      const isMobile = window.innerWidth < 768
      if (isMobile) {
        setVideoSource('https://cdn.playprove.one/landing/mobile.mp4')
      } else {
        setVideoSource('https://cdn.playprove.one/landing/desktop.mp4')
      }
    }
    updateVideoSource()
    window.addEventListener('resize', updateVideoSource)
    return () => {
      window.removeEventListener('resize', updateVideoSource)
    }
  }, [])

  const renderComponent = () => {
    if (currentComponent === 'HOME') {
      return <HomeItem />
    } else if (currentComponent === 'SCHEDULE') {
      return <ScheduleItem />
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-gray-100">
      <div className="flex h-full justify-center">
        <div className="relative h-screen w-full">
          <video
            src={videoSource}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <Disclosure as="nav" className="w-full bg-purple-950">
        <>
          <div className="mx-auto max-w-screen-xl px-4 lg:px-20">
            <div className="flex h-20 justify-between">
              <div className="flex">
                <div className="font-lg flex items-center font-bold text-gray-50">
                  HUDDLE
                </div>
                <div className="ml-4 flex space-x-2 sm:ml-6 sm:space-x-8">
                  <Disclosure.Button
                    as="button"
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-50 ${
                      currentComponent === 'HOME'
                        ? 'border-b-2 border-white'
                        : 'hover:gray-200 border-b-2 border-transparent hover:border-white'
                    }`}
                    onClick={() => setCurrentComponent('HOME')}
                  >
                    HOME
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      currentComponent === 'SCHEDULE'
                        ? 'border-b-2 border-white text-gray-50'
                        : 'hover:gray-200 border-b-2 border-transparent text-gray-50 hover:border-white'
                    }`}
                    onClick={() => setCurrentComponent('SCHEDULE')}
                  >
                    SCHEDULE
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>
        </>
      </Disclosure>
      {renderComponent()}
    </div>
  )
}

export default Home
