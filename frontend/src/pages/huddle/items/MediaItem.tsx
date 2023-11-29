import type { NewsCardProps } from '@/components/cards/NewsCard'
import NoticeWideCard from '@/components/cards/NoticeWideCard'

const galleryData: NewsCardProps[] = [
  {
    imageSrc: '/logo/KAFA_OG.png',
    title: 'Gallery Title 1',
    description: 'Gallery Description 1',
    variant: 'wide'
  },
  {
    imageSrc: '/logo/KAFA_OG.png',
    title: 'Gallery Title 2',
    description: 'Gallery Description 2',
    variant: 'wide'
  }
]

const videoSources = [
  {
    src: 'https://www.youtube.com/embed/k49FXPukAH4?si=eRRsoyZgrcmFnvOR',
    title: 'YouTube video player 1'
  }
]

const MediaItem = () => {
  const goToGallery = (id: number) => {
    console.log(id)
  }
  return (
    <div>
      <div className="bg-gray-800 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="col-span-1 mx-5 flex items-center justify-center">
            <div className="flex lg:max-w-2xl">
              {videoSources.map((video, index) => (
                <div key={index} className="w-screen">
                  <iframe
                    className="h-96 w-full sm:h-96"
                    src={video.src}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1 mx-5">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="mt-5 text-3xl font-bold">HIGHLIGHTS</div>
                <div className="text-md text-gray-400">
                  2023 서울지역 1부 결승 서울대학교 vs 성균관대학교
                </div>
              </div>
              <div className="self-start">
                <button className="mb-3">MORE</button>
                <div className="sm:flex sm:items-center sm:justify-center">
                  {videoSources.map((video, index) => (
                    <div
                      key={index}
                      className="mb-3 flex justify-center sm:mr-2"
                    >
                      <iframe
                        className="aspect-video w-full sm:max-w-xs"
                        src={video.src}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ))}
                  {videoSources.map((video, index) => (
                    <div
                      key={index}
                      className="mb-3 flex justify-center sm:mr-2"
                    >
                      <iframe
                        className="aspect-video w-full sm:max-w-xs"
                        src={video.src}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ))}
                  {videoSources.map((video, index) => (
                    <div
                      key={index}
                      className="mb-3 flex justify-center sm:mr-2"
                    >
                      <iframe
                        className="aspect-video w-full sm:max-w-xs"
                        src={video.src}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="mx-5 my-5">
          <NoticeWideCard
            id={2}
            cardName="NEWS"
            onClick={goToGallery}
            newsCardPropsArray={galleryData}
          />
        </div>
        <div className="mx-5 my-5">
          <NoticeWideCard
            id={2}
            cardName="GALLERY"
            onClick={goToGallery}
            newsCardPropsArray={galleryData}
          />
        </div>
      </div>
    </div>
  )
}

export default MediaItem
