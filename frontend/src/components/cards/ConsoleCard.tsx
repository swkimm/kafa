interface ConsoleCardProps {
  title: string
  subtitle: string
  children: React.ReactNode
  more?: () => void
}

const ConsoleCard: React.FC<ConsoleCardProps> = ({
  title,
  subtitle,
  children,
  more
}) => {
  return (
    <div className="overflow-hidden border-b-2 border-t-2 border-gray-200/60 bg-white sm:rounded-lg sm:border-2">
      <div className="px-4 py-5 sm:px-6 sm:py-7">
        <div className="flex">
          <div className="flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              {title}
            </h1>
            <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
          </div>
          {more ? (
            <div className="ml-16 mt-0 flex-none">
              <button
                type="button"
                onClick={more}
                className="font-base text-xs text-gray-500 hover:text-gray-400"
              >
                더 보기
              </button>
            </div>
          ) : null}
        </div>
        <div className="mt-8 flow-root">{children}</div>
      </div>
    </div>
  )
}

export default ConsoleCard
