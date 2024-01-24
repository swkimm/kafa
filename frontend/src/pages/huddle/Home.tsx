// Home.tsx
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
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
        {({ open }) => (
          <>
            <div className="mx-auto max-w-screen-xl px-4 lg:px-20">
              <div className="flex h-20 justify-between">
                <div className="flex">
                  <div className="font-lg flex flex-shrink-0 items-center font-bold text-gray-50">
                    HUDDLE
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
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
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
            <Disclosure.Panel className="sm:hidden">
              <div className="flex flex-col gap-y-2 pb-3">
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('HOME')}
                  className={`w-full pr-4 text-right text-sm font-normal text-gray-50 ${
                    currentComponent === 'HOME'
                      ? 'font-bold text-purple-500'
                      : 'hover:text-gray-500'
                  }`}
                >
                  HOME
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('SCHEDULE')}
                  className={`w-full pr-4 text-right text-sm font-normal text-gray-50 ${
                    currentComponent === 'SCHEDULE'
                      ? 'font-bold text-purple-500'
                      : 'hover:text-gray-500'
                  }`}
                >
                  SCHEDULE
                </Disclosure.Button>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      {renderComponent()}
    </div>
  )
}

export default Home
