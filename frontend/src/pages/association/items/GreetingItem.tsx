export const GreetingItem = () => {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 lg:px-20">
      <div className="px-4 sm:px-0">
        <h3 className="text-lg font-semibold leading-7 text-gray-900">
          인사말
        </h3>
        <p className="mt-1 max-w-2xl text-base leading-6 text-gray-500">
          대한미식축구협회장 인사말
        </p>
      </div>
      <div className="mt-6 px-4 sm:px-0">
        <div className="divide-y divide-gray-200">
          <img
            className="h-ull w-full rounded-lg object-cover"
            src="/association/greeting_image.jpeg"
            alt=""
          />
        </div>
      </div>
    </div>
  )
}
