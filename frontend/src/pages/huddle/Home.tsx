// Home.tsx
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import HomeItem from './items/HomeItem'
import MediaItem from './items/MediaItem'
import NoticeItem from './items/NoticeItem'
import PhotoItem from './items/PhotoItem'
import ScheduleItem from './items/ScheduleItem'

const Home = () => {
  const [currentComponent, setCurrentComponent] = useState<string | null>(
    'HOME'
  )

  const [videoSource, setVideoSource] = useState(
    'https://cdn.playprove.one/landing/desktop.mp4'
  )
  useEffect(() => {
    const updateVideoSource = () => {
      const isMobile = window.innerWidth < 768 // 768px 미만을 모바일로 가정
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
    } else if (currentComponent === 'NOTICE') {
      return <NoticeItem />
    } else if (currentComponent === 'MEDIA') {
      return <MediaItem />
    } else if (currentComponent === 'PHOTO') {
      return <PhotoItem />
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
      <Disclosure as="nav" className="w-full bg-indigo-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-screen-xl px-4 lg:px-20">
              <div className="flex h-20 justify-between">
                <div className="flex">
                  <div className="font-lg flex flex-shrink-0 items-center font-bold text-white">
                    HUDDLE
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-white ${
                        currentComponent === 'HOME'
                          ? 'border-b-2 border-white'
                          : 'border-b-2 border-transparent hover:border-white hover:text-black'
                      }`}
                      onClick={() => setCurrentComponent('HOME')}
                    >
                      HOME
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        currentComponent === 'SCHEDULE'
                          ? 'border-b-2 border-white text-white'
                          : 'border-b-2 border-transparent text-white hover:border-white hover:text-black'
                      }`}
                      onClick={() => setCurrentComponent('SCHEDULE')}
                    >
                      SCHEDULE
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        currentComponent === 'NOTICE'
                          ? 'border-b-2 border-white text-white'
                          : 'border-b-2 border-transparent text-white hover:border-white hover:text-black'
                      }`}
                      onClick={() => setCurrentComponent('NOTICE')}
                    >
                      NOTICE
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        currentComponent === 'MEDIA'
                          ? 'border-b-2 border-white text-white'
                          : 'border-b-2 border-transparent text-white hover:border-white hover:text-black'
                      }`}
                      onClick={() => setCurrentComponent('MEDIA')}
                    >
                      MEDIA
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        currentComponent === 'PHOTO'
                          ? 'border-b-2 border-white text-white'
                          : 'border-b-2 border-transparent text-white hover:border-white hover:text-black'
                      }`}
                      onClick={() => setCurrentComponent('PHOTO')}
                    >
                      PHOTO
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
              <div className="space-y-1 pb-3 pt-2">
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('NOTICE')}
                  className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
                >
                  HOME
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('SCHEDULE')}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  SCHEDULE
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('NOTICE')}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  NOTICE
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('MEDIA')}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  MEDIA
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => setCurrentComponent('PHOTO')}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                >
                  PHOTO
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
